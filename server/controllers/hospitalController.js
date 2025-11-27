const Donor = require('../models/Donor');

// Get pending verifications
exports.getPendingVerifications = async (req, res) => {
  try {
    const verifications = await Donor.getPendingVerifications();

    res.json({
      success: true,
      count: verifications.length,
      data: verifications
    });
  } catch (error) {
    console.error('Get pending verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Verify donor (approve/reject)
exports.verifyDonor = async (req, res) => {
  try {
    const { verificationId } = req.params;
    const { status, reason } = req.body;

    // Validation
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "approved" or "rejected"'
      });
    }

    if (status === 'rejected' && !reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const result = await Donor.updateVerificationStatus(
      verificationId,
      req.userId,
      status,
      reason
    );

    if (result) {
      res.json({
        success: true,
        message: `Donor ${status} successfully`
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to update verification status'
      });
    }
  } catch (error) {
    console.error('Verify donor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};