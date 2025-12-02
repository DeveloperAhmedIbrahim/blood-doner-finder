import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Switch } from '@mui/material';
import { adminAPI } from '../services/api';

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => { fetchHospitals(); }, []);

  const fetchHospitals = async () => {
    try {
      const res = await adminAPI.getAllHospitals();
      if (res.success) setHospitals(res.data || []);
    } catch (err) { console.error(err); }
  };

  const toggle = async (id, current) => {
    try {
      await adminAPI.updateHospitalStatus(id, !current);
      fetchHospitals();
    } catch (err) { console.error(err); alert('Failed'); }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Hospitals</Typography>
      <Paper sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: '#f6f8fa' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hospitals.map(h => (
                <TableRow key={h.id}>
                  <TableCell>{h.id}</TableCell>
                  <TableCell>{h.name}</TableCell>
                  <TableCell>{h.email}</TableCell>
                  <TableCell>{h.phone}</TableCell>
                  <TableCell><Switch checked={!!h.is_active} onChange={() => toggle(h.id, !!h.is_active)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
