const db = require('../config/database');

class Donation {
  // Record donation
  static async create(donationData) {
    try {
      const {
        donor_id,
        request_id,
        hospital_id,
        units_donated,
        notes,
      } = donationData;

      const [result] = await db.query(
        `INSERT INTO donations 
         (donor_id, request_id, hospital_id, units_donated, notes) 
         VALUES (?, ?, ?, ?, ?)`,
        [donor_id, request_id, hospital_id, units_donated, notes]
      );

      // Update donor's last donation date
      await db.query(
        `UPDATE users 
         SET last_donation_date = CURDATE() 
         WHERE id = ?`,
        [donor_id]
      );

      // Update request status to fulfilled
      await db.query(
        `UPDATE blood_requests 
         SET status = 'fulfilled' 
         WHERE id = ?`,
        [request_id]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get donation by ID
  static async getById(donationId) {
    try {
      const [rows] = await db.query(
        `SELECT d.*, 
                donor.name as donor_name, donor.blood_group as donor_blood_group,
                hospital.name as hospital_name,
                br.patient_id, patient.name as patient_name
         FROM donations d
         JOIN users donor ON d.donor_id = donor.id
         JOIN users hospital ON d.hospital_id = hospital.id
         JOIN blood_requests br ON d.request_id = br.id
         JOIN users patient ON br.patient_id = patient.id
         WHERE d.id = ?`,
        [donationId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get donations by hospital
  static async getByHospitalId(hospitalId, limit = 50) {
    try {
      const [rows] = await db.query(
        `SELECT d.*, 
                donor.name as donor_name, donor.blood_group as donor_blood_group,
                patient.name as patient_name
         FROM donations d
         JOIN users donor ON d.donor_id = donor.id
         JOIN blood_requests br ON d.request_id = br.id
         JOIN users patient ON br.patient_id = patient.id
         WHERE d.hospital_id = ?
         ORDER BY d.donation_date DESC
         LIMIT ?`,
        [hospitalId, limit]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get donations by donor
  static async getByDonorId(donorId) {
    try {
      const [rows] = await db.query(
        `SELECT d.*, 
                hospital.name as hospital_name,
                patient.name as patient_name
         FROM donations d
         JOIN users hospital ON d.hospital_id = hospital.id
         JOIN blood_requests br ON d.request_id = br.id
         JOIN users patient ON br.patient_id = patient.id
         WHERE d.donor_id = ?
         ORDER BY d.donation_date DESC`,
        [donorId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Check if donor is eligible (90 days cooldown)
  static async isDonorEligible(donorId) {
    try {
      const [rows] = await db.query(
        `SELECT last_donation_date,
                DATEDIFF(CURDATE(), last_donation_date) as days_since_last_donation
         FROM users 
         WHERE id = ?`,
        [donorId]
      );

      if (!rows[0] || !rows[0].last_donation_date) {
        return { eligible: true, message: 'No previous donations' };
      }

      const daysSince = rows[0].days_since_last_donation;
      if (daysSince >= 90) {
        return { eligible: true, message: 'Eligible to donate' };
      } else {
        return {
          eligible: false,
          message: `Must wait ${90 - daysSince} more days`,
          days_remaining: 90 - daysSince,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  // Get donation statistics
  static async getStats(hospitalId = null) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_donations,
          SUM(units_donated) as total_units,
          COUNT(DISTINCT donor_id) as unique_donors
        FROM donations
      `;

      const params = [];
      if (hospitalId) {
        query += ' WHERE hospital_id = ?';
        params.push(hospitalId);
      }

      const [rows] = await db.query(query, params);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Donation;