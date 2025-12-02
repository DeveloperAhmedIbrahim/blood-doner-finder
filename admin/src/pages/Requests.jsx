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
  Chip,
  Button,
} from '@mui/material';
import { adminAPI } from '../services/api';

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await adminAPI.getAllRequests();
      if (response.success) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error('Fetch requests error:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Blood Requests
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Blood Group</TableCell>
              <TableCell>Units</TableCell>
              <TableCell>Urgency</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {requests.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.patient_name || r.patient_id}</TableCell>
                <TableCell>{r.blood_group}</TableCell>
                <TableCell>{r.units_needed}</TableCell>
                <TableCell>
                  <Chip label={r.urgency} size="small" />
                </TableCell>
                <TableCell>
                  {r.hospital_name || `${r.latitude}, ${r.longitude}`}
                </TableCell>
                <TableCell>
                  <Chip label={r.status} size="small" />
                </TableCell>
                <TableCell>
                  {new Date(r.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => alert(JSON.stringify(r, null, 2))}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Requests;
