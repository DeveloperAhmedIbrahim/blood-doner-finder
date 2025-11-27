const db = require('../config/database');

class Donor {
  // Complete donor profile
  static async completeProfile(userId, profileData) {
    try {
      const { blood_group, cnic, latitude, longitude, address } = profileData;
      
      const [result] = await db.query(
        `UPDATE users 
         SET blood_group = ?, cnic = ?, latitude = ?, longitude = ?, 
             address = ?, profile_completed = TRUE 
         WHERE id = ? AND role = 'donor'`,
        [blood_group, cnic, latitude, longitude, address, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Submit verification request with CNIC images
  static async submitVerification(donorId, cnicImages) {
    try {
      const { cnic_front, cnic_back } = cnicImages;
      
      // Check if already submitted
      const [existing] = await db.query(
        'SELECT * FROM donor_verifications WHERE donor_id = ?',
        [donorId]
      );

      if (existing.length > 0) {
        // Update existing
        const [result] = await db.query(
          `UPDATE donor_verifications 
           SET cnic_front_image = ?, cnic_back_image = ?, 
               verification_status = 'pending', submitted_at = NOW() 
           WHERE donor_id = ?`,
          [cnic_front, cnic_back, donorId]
        );
        return result.affectedRows > 0;
      } else {
        // Insert new
        const [result] = await db.query(
          `INSERT INTO donor_verifications 
           (donor_id, cnic_front_image, cnic_back_image) 
           VALUES (?, ?, ?)`,
          [donorId, cnic_front, cnic_back]
        );
        return result.insertId;
      }
    } catch (error) {
      throw error;
    }
  }

  // Get verification status
  static async getVerificationStatus(donorId) {
    try {
      const [rows] = await db.query(
        `SELECT dv.*, u.name as verified_by_name 
         FROM donor_verifications dv
         LEFT JOIN users u ON dv.verified_by_hospital_id = u.id
         WHERE dv.donor_id = ?`,
        [donorId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get pending verifications (for hospital)
  static async getPendingVerifications() {
    try {
      const [rows] = await db.query(
        `SELECT dv.*, u.name, u.email, u.phone, u.cnic, u.blood_group, u.address
         FROM donor_verifications dv
         JOIN users u ON dv.donor_id = u.id
         WHERE dv.verification_status = 'pending'
         ORDER BY dv.submitted_at DESC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Approve/Reject verification
  static async updateVerificationStatus(verificationId, hospitalId, status, reason = null) {
    try {
      const [result] = await db.query(
        `UPDATE donor_verifications 
         SET verification_status = ?, verified_by_hospital_id = ?, 
             rejection_reason = ?, verified_at = NOW() 
         WHERE id = ?`,
        [status, hospitalId, reason, verificationId]
      );

      // Update user verification status
      if (status === 'approved') {
        await db.query(
          `UPDATE users SET is_verified = TRUE WHERE id = (
            SELECT donor_id FROM donor_verifications WHERE id = ?
          )`,
          [verificationId]
        );
      }

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get donor profile
  static async getDonorProfile(donorId) {
    try {
      const [rows] = await db.query(
        `SELECT id, name, email, phone, cnic, blood_group, 
                latitude, longitude, address, is_verified, profile_completed, created_at
         FROM users 
         WHERE id = ? AND role = 'donor'`,
        [donorId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Donor;