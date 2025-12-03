import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';
import { People, Bloodtype, LocalHospital, Assignment, Favorite } from '@mui/icons-material';
import StatCard from '../components/StatCard';
import { adminAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDashboardStats();
      if (res.success) setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Users" value={stats.totalUsers} icon={<People />} color="#1976D2" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Donors" value={stats.totalDonors} icon={<Bloodtype />} color="#d32f2f" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Hospitals" value={stats.totalHospitals} icon={<LocalHospital />} color="#2e7d32" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Requests" value={stats.totalRequests} icon={<Assignment />} color="#ed6c02" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Donations" value={stats.totalDonations} icon={<Favorite />} color="#9c27b0" /></Grid>
      </Grid>
    </Box>
  );
}
