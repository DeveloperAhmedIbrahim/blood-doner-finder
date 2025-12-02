import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Chip } from '@mui/material';
import { adminAPI } from '../services/api';

export default function Donors() {
  const [tab, setTab] = useState(0);
  const [donors, setDonors] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const a = await adminAPI.getAllDonors();
      if (a.success) setDonors(a.data || []);
      const b = await adminAPI.getPendingDonors();
      if (b.success) setPending(b.data || []);
    } catch (err) { console.error(err); }
  };

  const handleVerify = async (id, status) => {
    try {
      await adminAPI.verifyDonor(id, status);
      alert('Done');
      fetchAll();
    } catch (err) { console.error(err); alert('Failed'); }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Donors</Typography>

      <Paper sx={{ p: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="All Donors" />
          <Tab label={`Pending (${pending.length})`} />
        </Tabs>

        {tab === 0 && (
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead sx={{ background: '#f6f8fa' }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Blood</TableCell>
                  <TableCell>CNIC</TableCell>
                  <TableCell>Verified</TableCell>
                  <TableCell>Last Donation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donors.map(d => (
                  <TableRow key={d.id}>
                    <TableCell>{d.id}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell><Chip label={d.blood_group || 'N/A'} color="error" size="small"/></TableCell>
                    <TableCell>{d.cnic || '-'}</TableCell>
                    <TableCell>{d.is_verified ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{d.last_donation_date || 'Never'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tab === 1 && (
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead sx={{ background: '#f6f8fa' }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Blood</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pending.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.donor_id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.blood_group || '-'}</TableCell>
                    <TableCell>{new Date(p.submitted_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button size="small" variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleVerify(p.id, 'approved')}>Approve</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleVerify(p.id, 'rejected')}>Reject</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
