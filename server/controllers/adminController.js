const db = require('../config/database');

// Helper to send consistent response
const sendSuccess = (res, data) => res.json({ success: true, data });
const sendError = (res, message = 'Server error', code = 500) =>
  res.status(code).json({ success: false, message });

exports.getStats = async (req, res) => {
  try {
    const [
      [usersCount],
    ] = await db.query('SELECT COUNT(*) as totalUsers FROM users');

    const [
      [donorsCount],
    ] = await db.query("SELECT COUNT(*) as totalDonors FROM users WHERE role='donor'");

    const [
      [hospitalsCount],
    ] = await db.query("SELECT COUNT(*) as totalHospitals FROM users WHERE role='hospital'");

    const [
      [requestsCount],
    ] = await db.query("SELECT COUNT(*) as totalRequests FROM blood_requests");

    const [
      [donationsCount],
    ] = await db.query("SELECT COUNT(*) as totalDonations FROM donations");

    return res.json({
      success: true,
      data: {
        totalUsers: usersCount.totalUsers || 0,
        totalDonors: donorsCount.totalDonors || 0,
        totalHospitals: hospitalsCount.totalHospitals || 0,
        totalRequests: requestsCount.totalRequests || 0,
        totalDonations: donationsCount.totalDonations || 0,
      },
    });
  } catch (error) {
    console.error('getStats error:', error);
    return sendError(res);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, phone, role, is_verified, blood_group, cnic, created_at FROM users ORDER BY id DESC');
    return sendSuccess(res, rows);
  } catch (error) {
    console.error('getAllUsers error:', error);
    return sendError(res);
  }
};

exports.blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // toggle a blocked flag — if you don't have blocked column, we will create or use is_active
    // Here we'll assume `is_active` column exists; if not, create it in DB (tinyint)
    // If not present, we emulate by setting is_verified = 0 (NOT ideal). Best: add is_active column.
    const { is_active } = req.body;
    if (typeof is_active === 'undefined') {
      // toggle existing is_verified as fallback (not recommended)
      const [userRows] = await db.query('SELECT is_verified FROM users WHERE id = ?', [userId]);
      if (!userRows[0]) return sendError(res, 'User not found', 404);
      const newVal = userRows[0].is_verified ? 0 : 1;
      await db.query('UPDATE users SET is_verified = ? WHERE id = ?', [newVal, userId]);
      return res.json({ success: true, message: 'User verification toggled' });
    } else {
      await db.query('UPDATE users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, userId]);
      return res.json({ success: true, message: 'User status updated' });
    }
  } catch (error) {
    console.error('blockUser error:', error);
    return sendError(res);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await db.query('DELETE FROM users WHERE id = ?', [userId]);
    return res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('deleteUser error:', error);
    return sendError(res);
  }
};

exports.getAllDonors = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, phone, blood_group, cnic, is_verified, last_donation_date FROM users WHERE role = 'donor' ORDER BY id DESC");
    return sendSuccess(res, rows);
  } catch (error) {
    console.error('getAllDonors error:', error);
    return sendError(res);
  }
};

exports.getPendingDonors = async (req, res) => {
  try {
    // We have a donor_verifications table — return pending verifications with requester info
    const [rows] = await db.query(`
      SELECT dv.id, dv.donor_id, dv.cnic_front_image, dv.cnic_back_image, dv.verification_status, dv.submitted_at, u.name, u.email, u.blood_group, u.cnic as user_cnic
      FROM donor_verifications dv
      LEFT JOIN users u ON dv.donor_id = u.id
      WHERE dv.verification_status = 'pending'
      ORDER BY dv.submitted_at DESC
    `);
    return sendSuccess(res, rows);
  } catch (error) {
    console.error('getPendingDonors error:', error);
    return sendError(res);
  }
};

exports.verifyDonor = async (req, res) => {
  try {
    const donorVerificationId = req.params.id; // could be donor id or donor_verifications.id depending on client
    const { status, reason } = req.body;

    // First try to find record in donor_verifications by id
    const [dvRows] = await db.query('SELECT * FROM donor_verifications WHERE id = ?', [donorVerificationId]);
    if (dvRows.length === 0) {
      // fallback: treat param as donor_id and update donor_verifications by donor_id
      const [dvRowsByDonor] = await db.query('SELECT * FROM donor_verifications WHERE donor_id = ? ORDER BY submitted_at DESC LIMIT 1', [donorVerificationId]);
      if (dvRowsByDonor.length === 0) {
        return sendError(res, 'Verification record not found', 404);
      }
      // use id from dvRowsByDonor
      const dvId = dvRowsByDonor[0].id;
      await db.query('UPDATE donor_verifications SET verification_status = ?, rejection_reason = ?, verified_by_hospital_id = ?, verified_at = NOW() WHERE id = ?', [status, reason || null, req.userId, dvId]);
      // update users table if approved
      if (status === 'approved') {
        await db.query('UPDATE users SET is_verified = 1 WHERE id = ?', [donorVerificationId]);
      } else if (status === 'rejected') {
        await db.query('UPDATE users SET is_verified = 0 WHERE id = ?', [donorVerificationId]);
      }
      return res.json({ success: true, message: `Donor ${status}` });
    } else {
      const dv = dvRows[0];
      await db.query('UPDATE donor_verifications SET verification_status = ?, rejection_reason = ?, verified_by_hospital_id = ?, verified_at = NOW() WHERE id = ?', [status, reason || null, req.userId, dv.id]);
      if (status === 'approved') {
        await db.query('UPDATE users SET is_verified = 1 WHERE id = ?', [dv.donor_id]);
      } else if (status === 'rejected') {
        await db.query('UPDATE users SET is_verified = 0 WHERE id = ?', [dv.donor_id]);
      }
      return res.json({ success: true, message: `Donor ${status}` });
    }
  } catch (error) {
    console.error('verifyDonor error:', error);
    return sendError(res);
  }
};

exports.getAllHospitals = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, phone, is_active, created_at FROM users WHERE role = 'hospital' ORDER BY id DESC");
    return sendSuccess(res, rows);
  } catch (error) {
    console.error('getAllHospitals error:', error);
    return sendError(res);
  }
};

exports.updateHospitalStatus = async (req, res) => {
  try {
    const hospitalId = req.params.id;
    const { is_active } = req.body;
    await db.query('UPDATE users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, hospitalId]);
    return res.json({ success: true, message: 'Hospital status updated' });
  } catch (error) {
    console.error('updateHospitalStatus error:', error);
    return sendError(res);
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    // join with users to get patient info
    const [rows] = await db.query(`
      SELECT br.*, u.name as patient_name, u.phone as patient_phone
      FROM blood_requests br
      LEFT JOIN users u ON br.patient_id = u.id
      ORDER BY br.created_at DESC
    `);
    return sendSuccess(res, rows);
  } catch (error) {
    console.error('getAllRequests error:', error);
    return sendError(res);
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.*, donor.name as donor_name, hosp.name as hospital_name
      FROM donations d
      LEFT JOIN users donor ON d.donor_id = donor.id
      LEFT JOIN users hosp ON d.hospital_id = hosp.id
      ORDER BY d.created_at DESC
    `);
    return sendSuccess(res, rows);
  } catch (error) {
    console.error('getAllDonations error:', error);
    return sendError(res);
  }
};
