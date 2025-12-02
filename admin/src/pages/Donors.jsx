import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { adminAPI } from '../services/api';

const Donors = () => {
  const [tab, setTab] = useState(0);
  const [donors, setDonors] = useState([]);
  const [pendingDonors, setPendingDonors] = useState([]);

  useEffect(() => {
    fetchDonors();
    fetchPendingDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await adminAPI.getAllDonors();
      if (response.success) {
        setDonors(response.data);
      }
    } catch (error) {
      console.error('Fetch donors error:', error);
    }
  };

  const fetchPendingDonors = async () => {
    try {
      const response = await adminAPI.getPendingDonors();
      if (response.success) {
        setPendingDonors(response.data);
      }
    } catch (error) {
      console.error('Fetch pending donors error:', error);
    }
  };

  const handleVerify = async (donorId, status) => {
    try {
      await adminAPI.verifyDonor(donorId, status, null);
      alert(`Donor ${status} successfully`);
      fetchDonors();
      fetchPendingDonors();
    } catch (error) {
      alert('Failed to verify donor');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Donors Management
      </Typography>

      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="All Donors" />
        <Tab label={`Pending Verification (${pendingDonors.length})`} />
      </Tabs>

      {tab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Blood Group</TableCell>
                <TableCell>CNIC</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Donation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donors.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell>{donor.id}</TableCell>
                  <TableCell>{donor.name}</TableCell>
                  <TableCell>
                    <Chip label={donor.blood_group} color="error" size="small" />
                  </TableCell>
                  <TableCell>{donor.cnic}</TableCell>
                  <TableCell>
                    {donor.is_verified ? (
                      <Chip label="Verified" color="success" size="small" />
                    ) : (
                      <Chip label="Pending" color="warning" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {donor.last_donation_date || 'Never'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Blood Group</TableCell>
                <TableCell>CNIC</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingDonors.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell>{donor.id}</TableCell>
                  <TableCell>{donor.name}</TableCell>
                  <TableCell>
                    <Chip label={donor.blood_group} color="error" size="small" />
                  </TableCell>
                  <TableCell>{donor.cnic}</TableCell>
                  <TableCell>
                    {new Date(donor.submitted_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="success"
                      sx={{ mr: 1 }}
                      onClick={() => handleVerify(donor.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleVerify(donor.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Donors;