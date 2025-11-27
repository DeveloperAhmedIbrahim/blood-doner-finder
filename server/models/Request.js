const db = require('../config/database');

class Request {
  // Create new blood request
  static async create(requestData) {
    try {
      const {
        patient_id,
        blood_group,
        units_needed,
        urgency,
        latitude,
        longitude,
        hospital_name,
        contact_number,
        additional_notes,
      } = requestData;

      const [result] = await db.query(
        `INSERT INTO blood_requests 
         (patient_id, blood_group, units_needed, urgency, latitude, longitude, 
          hospital_name, contact_number, additional_notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          patient_id,
          blood_group,
          units_needed,
          urgency,
          latitude,
          longitude,
          hospital_name,
          contact_number,
          additional_notes,
        ]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Get request by ID with patient details
  static async getById(requestId) {
    try {
      const [rows] = await db.query(
        `SELECT br.*, u.name as patient_name, u.email as patient_email, 
                u.phone as patient_phone
         FROM blood_requests br
         JOIN users u ON br.patient_id = u.id
         WHERE br.id = ?`,
        [requestId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get patient's requests
  static async getByPatientId(patientId) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM blood_requests 
         WHERE patient_id = ? 
         ORDER BY created_at DESC`,
        [patientId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get active requests (for donors)
  static async getActiveRequests() {
    try {
      const [rows] = await db.query(
        `SELECT br.*, u.name as patient_name, u.phone as patient_phone
         FROM blood_requests br
         JOIN users u ON br.patient_id = u.id
         WHERE br.status = 'active'
         ORDER BY br.urgency DESC, br.created_at DESC`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get all requests (for hospital)
  static async getAllRequests() {
    try {
      const [rows] = await db.query(
        `SELECT br.*, u.name as patient_name, u.email as patient_email, 
                u.phone as patient_phone
         FROM blood_requests br
         JOIN users u ON br.patient_id = u.id
         ORDER BY br.created_at DESC
         LIMIT 100`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Find nearby verified donors
  static async findNearbyDonors(bloodGroup, latitude, longitude, radiusKm = 50) {
    try {
      // Haversine formula for distance calculation
      const [rows] = await db.query(
        `SELECT u.id, u.name, u.email, u.phone, u.blood_group, 
                u.latitude, u.longitude, u.fcm_token,
                (6371 * acos(cos(radians(?)) * cos(radians(u.latitude)) * 
                cos(radians(u.longitude) - radians(?)) + sin(radians(?)) * 
                sin(radians(u.latitude)))) AS distance
         FROM users u
         WHERE u.role = 'donor' 
         AND u.is_verified = TRUE 
         AND u.blood_group = ?
         AND u.latitude IS NOT NULL 
         AND u.longitude IS NOT NULL
         HAVING distance < ?
         ORDER BY distance ASC`,
        [latitude, longitude, latitude, bloodGroup, radiusKm]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update request status
  static async updateStatus(requestId, status) {
    try {
      const [result] = await db.query(
        `UPDATE blood_requests SET status = ? WHERE id = ?`,
        [status, requestId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Record donor response
  static async recordResponse(requestId, donorId, response, message) {
    try {
      const [result] = await db.query(
        `INSERT INTO request_responses (request_id, donor_id, response, message) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE response = ?, message = ?`,
        [requestId, donorId, response, message, response, message]
      );
      return result.insertId || result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get responses for a request
  static async getResponses(requestId) {
    try {
      const [rows] = await db.query(
        `SELECT rr.*, u.name as donor_name, u.phone as donor_phone, 
                u.blood_group
         FROM request_responses rr
         JOIN users u ON rr.donor_id = u.id
         WHERE rr.request_id = ?
         ORDER BY rr.responded_at DESC`,
        [requestId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Request;