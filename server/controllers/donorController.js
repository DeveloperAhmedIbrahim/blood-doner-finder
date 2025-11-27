const Donor = require('../models/Donor');

// Complete donor profile
exports.completeProfile = async (req, res) => {
  try {
    const { blood_group, cnic, latitude, longitude, address } = req.body;

    // Validation
    if (!blood_group || !cnic) {
      return res.status(400).json({
        success: false,
        message: 'Blood group and CNIC are required'
      });
    }

    // CNIC validation (13 digits)
    if (!/^\d{13}$/.test(cnic.replace(/-/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid CNIC format. Must be 13 digits'
      });
    }

    const result = await Donor.completeProfile(req.userId, {
      blood_group,
      cnic,
      latitude: latitude || null,
      longitude: longitude || null,
      address: address || null
    });

    if (result) {
      res.json({
        success: true,
        message: 'Profile completed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  } catch (error) {
    console.error('Complete profile error:', error);
    
    // Handle duplicate CNIC
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'CNIC already registered'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Upload CNIC images
exports.uploadCNIC = async (req, res) => {
  try {
    if (!req.files || !req.files.cnic_front || !req.files.cnic_back) {
      return res.status(400).json({
        success: false,
        message: 'Both CNIC front and back images are required'
      });
    }

    const cnicImages = {
      cnic_front: req.files.cnic_front[0].filename,
      cnic_back: req.files.cnic_back[0].filename
    };

    const result = await Donor.submitVerification(req.userId, cnicImages);

    if (result) {
      res.json({
        success: true,
        message: 'CNIC images uploaded successfully. Waiting for verification.',
        data: cnicImages
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to upload CNIC images'
      });
    }
  } catch (error) {
    console.error('Upload CNIC error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get verification status
exports.getVerificationStatus = async (req, res) => {
  try {
    const status = await Donor.getVerificationStatus(req.userId);

    if (status) {
      res.json({
        success: true,
        data: status
      });
    } else {
      res.json({
        success: true,
        data: null,
        message: 'No verification request found'
      });
    }
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get donor profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await Donor.getDonorProfile(req.userId);

    if (profile) {
      res.json({
        success: true,
        data: profile
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Donor profile not found'
      });
    }
  } catch (error) {
    console.error('Get donor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};