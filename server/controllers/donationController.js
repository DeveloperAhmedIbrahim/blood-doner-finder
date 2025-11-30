const Donation = require('../models/Donation');
const Notification = require('../models/Notification');

// Record donation (Hospital)
exports.recordDonation = async (req, res) => {
  try {
    const { donor_id, request_id, units_donated, notes } = req.body;

    // Validation
    if (!donor_id || !request_id) {
      return res.status(400).json({
        success: false,
        message: 'Donor ID and Request ID are required',
      });
    }

    // Check if donor is eligible
    const eligibility = await Donation.isDonorEligible(donor_id);
    if (!eligibility.eligible) {
      return res.status(400).json({
        success: false,
        message: eligibility.message,
        days_remaining: eligibility.days_remaining,
      });
    }

    // Record donation
    const donationId = await Donation.create({
      donor_id,
      request_id,
      hospital_id: req.userId,
      units_donated: units_donated || 1,
      notes: notes || null,
    });

    // Get donation details for notifications
    const donation = await Donation.getById(donationId);

    // Send notification to donor
    await Notification.create({
      user_id: donor_id,
      title: 'Thank You for Donating!',
      message: `Your donation of ${units_donated || 1} unit(s) has been recorded. You helped save a life!`,
      type: 'donation',
      request_id: request_id,
    });

    // Send notification to patient
    await Notification.create({
      user_id: donation.patient_id,
      title: 'Donation Completed',
      message: `A donor has fulfilled your blood request. Thank you for using our service!`,
      type: 'donation',
      request_id: request_id,
    });

    res.status(201).json({
      success: true,
      message: 'Donation recorded successfully',
      data: {
        donationId,
        donation,
      },
    });
  } catch (error) {
    console.error('Record donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record donation',
    });
  }
};

// Get hospital donations
exports.getHospitalDonations = async (req, res) => {
  try {
    const donations = await Donation.getByHospitalId(req.userId);

    res.json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.error('Get hospital donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations',
    });
  }
};

// Get donor's donation history
exports.getDonorHistory = async (req, res) => {
  try {
    const donations = await Donation.getByDonorId(req.userId);

    res.json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.error('Get donor history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation history',
    });
  }
};

// Check donor eligibility
exports.checkEligibility = async (req, res) => {
  try {
    const { donorId } = req.params;

    const eligibility = await Donation.isDonorEligible(donorId);

    res.json({
      success: true,
      data: eligibility,
    });
  } catch (error) {
    console.error('Check eligibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check eligibility',
    });
  }
};

// Get donation statistics
exports.getStats = async (req, res) => {
  try {
    const stats = await Donation.getStats(req.userId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
    });
  }
};