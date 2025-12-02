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
  Switch,
} from '@mui/material';
import { adminAPI } from '../services/api';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await adminAPI.getAllHospitals();
      if (response.success) {
        setHospitals(response.data);
      }
    } catch (error) {
      console.error('Fetch hospitals error:', error);
    }
  };

  const handleToggleStatus = async (hospitalId, currentStatus) => {
    try {
      await adminAPI.updateHospitalStatus(hospitalId, !currentStatus);
      fetchHospitals();
    } catch (error) {
      alert('Failed to update hospital status');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Hospitals
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {hospitals.map((h) => (
              <TableRow key={h.id}>
                <TableCell>{h.id}</TableCell>
                <TableCell>{h.name}</TableCell>
                <TableCell>{h.email}</TableCell>
                <TableCell>{h.phone}</TableCell>
                <TableCell>
                  <Switch
                    checked={!!h.is_active}
                    onChange={() => handleToggleStatus(h.id, !!h.is_active)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => alert(JSON.stringify(h, null, 2))}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {hospitals.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hospitals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Hospitals;
