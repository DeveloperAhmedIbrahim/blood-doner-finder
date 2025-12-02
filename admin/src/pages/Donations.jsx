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
} from '@mui/material';
import { adminAPI } from '../services/api';

const Donations = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await adminAPI.getAllDonations();
      if (response.success) {
        setDonations(response.data);
      }
    } catch (error) {
      console.error('Fetch donations error:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Donations
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Donor</TableCell>
              <TableCell>Request ID</TableCell>
              <TableCell>Hospital</TableCell>
              <TableCell>Units</TableCell>
              <TableCell>Donation Date</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {donations.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.id}</TableCell>
                <TableCell>{d.donor_name || d.donor_id}</TableCell>
                <TableCell>{d.request_id}</TableCell>
                <TableCell>{d.hospital_name || d.hospital_id}</TableCell>
                <TableCell>{d.units_donated}</TableCell>
                <TableCell>{new Date(d.donation_date).toLocaleString()}</TableCell>
                <TableCell>{d.notes || '-'}</TableCell>
              </TableRow>
            ))}

            {donations.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No donations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Donations;
