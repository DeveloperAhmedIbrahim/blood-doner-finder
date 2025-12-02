import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import { adminAPI } from '../services/api';

export default function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await adminAPI.getAllRequests();
      if (res.success) setRequests(res.data || []);
    } catch (err) { console.error(err); }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Blood Requests</Typography>
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: '#f6f8fa' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Units</TableCell>
                <TableCell>Urgency</TableCell>
                <TableCell>Hospital</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.patient_name || r.patient_id}</TableCell>
                  <TableCell>{r.blood_group}</TableCell>
                  <TableCell>{r.units_needed}</TableCell>
                  <TableCell><Chip label={r.urgency} size="small" /></TableCell>
                  <TableCell>{r.hospital_name || `${r.latitude},${r.longitude}`}</TableCell>
                  <TableCell><Chip label={r.status} size="small" color={r.status === 'fulfilled' ? 'success' : (r.status === 'cancelled' ? 'error' : 'warning')} /></TableCell>
                  <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
