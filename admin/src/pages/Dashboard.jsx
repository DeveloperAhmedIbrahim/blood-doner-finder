import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { People, Bloodtype, LocalHospital, Assignment, Favorite } from '@mui/icons-material';
import StatCard from '../components/StatCard';
import { adminAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalHospitals: 0,
    totalRequests: 0,
    totalDonations: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<People />}
            color="#457B9D"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Donors"
            value={stats.totalDonors}
            icon={<Bloodtype />}
            color="#E63946"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Hospitals"
            value={stats.totalHospitals}
            icon={<LocalHospital />}
            color="#06A77D"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Blood Requests"
            value={stats.totalRequests}
            icon={<Assignment />}
            color="#F77F00"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Donations"
            value={stats.totalDonations}
            icon={<Favorite />}
            color="#DC3545"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;