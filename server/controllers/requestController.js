const Request = require('../models/Request');

// Create blood request (Patient)
exports.createRequest = async (req, res) => {
  try {
    const {
      blood_group,
      units_needed,
      urgency,
      latitude,
      longitude,
      hospital_name,
      contact_number,
      additional_notes,
    } = req.body;

    // Validation
    if (!blood_group || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Blood group and location are required',
      });
    }

    // Create request
    const requestId = await Request.create({
      patient_id: req.userId,
      blood_group,
      units_needed: units_needed || 1,
      urgency: urgency || 'medium',
      latitude,
      longitude,
      hospital_name: hospital_name || null,
      contact_number: contact_number || null,
      additional_notes: additional_notes || null,
    });

    // Find nearby donors
    const nearbyDonors = await Request.findNearbyDonors(
      blood_group,
      latitude,
      longitude
    );

    // TODO: Send notifications to donors (Module 5)
    console.log(`Found ${nearbyDonors.length} nearby donors for notification`);

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      data: {
        requestId,
        nearbyDonorsCount: nearbyDonors.length,
      },
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blood request',
    });
  }
};

// Get patient's own requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.getByPatientId(req.userId);

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
    });
  }
};

// Get active requests (for donors)
exports.getActiveRequests = async (req, res) => {
  try {
    const requests = await Request.getActiveRequests();
    // Add responses for current donor
    for (let request of requests) {
      const responses = await Request.getResponses(request.id);
      const myResponse = responses.find(r => r.donor_id === req.userId);
      request.my_response = myResponse ? myResponse.response : null;
    }
    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Get active requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
    });
  }
};

// Get all requests (for hospital)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.getAllRequests();

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requests',
    });
  }
};

// Get single request details
exports.getRequestDetails = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.getById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Add my response
    const responses = await Request.getResponses(requestId);
    const myResponse = responses.find(r => r.donor_id === req.userId);
    request.my_response = myResponse ? myResponse.response : null;

    res.json({ success: true, data: { request } });
  } catch (error) {
    console.error('Get request details error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch details' });
  }
};

// Respond to request (Donor)
exports.respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { response, message } = req.body;

    // Validation
    if (!['accepted', 'rejected'].includes(response)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid response. Must be "accepted" or "rejected"',
      });
    }

    // Record response
    await Request.recordResponse(requestId, req.userId, response, message);

    res.json({
      success: true,
      message: `Request ${response} successfully`,
    });
  } catch (error) {
    console.error('Respond to request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to respond to request',
    });
  }
};

// Cancel request (Patient)
exports.cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Verify ownership
    const request = await Request.getById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    if (request.patient_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await Request.updateStatus(requestId, 'cancelled');

    res.json({
      success: true,
      message: 'Request cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel request',
    });
  }
};

// Respond to request (Donor) - UPDATED
exports.respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { response, message } = req.body;

    // Validation
    if (!['accepted', 'rejected'].includes(response)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid response. Must be "accepted" or "rejected"',
      });
    }

    // Get request details
    const request = await Request.getById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // Record response
    await Request.recordResponse(requestId, req.userId, response, message);

    // If accepted, create initial chat message
    if (response === 'accepted') {
      const Chat = require('../models/Chat');
      await Chat.sendMessage({
        request_id: requestId,
        sender_id: req.userId,
        receiver_id: request.patient_id,
        message: message || 'I can help! Let me know how to proceed.',
      });
    }

    res.json({
      success: true,
      message: `Request ${response} successfully`,
      data: {
        patient_id: response === 'accepted' ? request.patient_id : null,
      },
    });
  } catch (error) {
    console.error('Respond to request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to respond to request',
    });
  }
};