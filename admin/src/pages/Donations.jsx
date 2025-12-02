import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { adminAPI } from '../services/api';

export default function Donations() {
  const [donations, setDonations] = useState([]);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try {
      const res = await adminAPI.getAllDonations();
      if (res.success) setDonations(res.data || []);
    } catch (err) { console.error(err); }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Donations</Typography>
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: '#f6f8fa' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Donor</TableCell>
                <TableCell>Request</TableCell>
                <TableCell>Hospital</TableCell>
                <TableCell>Units</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donations.map(d => (
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
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
