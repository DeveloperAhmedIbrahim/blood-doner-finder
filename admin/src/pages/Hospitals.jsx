import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, TableContainer, Table, 
  TableHead, TableRow, TableCell, TableBody, Switch,
  Snackbar, Alert 
} from '@mui/material';
import { adminAPI } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, id: null, current: null });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchHospitals(); }, []);

  const fetchHospitals = async () => {
    try {
      const res = await adminAPI.getAllHospitals();
      if (res.success) setHospitals(res.data || []);
    } catch (err) { console.error(err); }
  };

  const handleToggle = (id, current) => {
    setConfirm({
      open: true,
      id,
      current,
    });
  };

  const onConfirm = async () => {
    const { id, current } = confirm;
    setConfirm({ open: false });

    try {
      await adminAPI.updateHospitalStatus(id, !current);

      setToast({
        open: true,
        message: !current ? 'Hospital Activated' : 'Hospital Deactivated',
        severity: 'success'
      });

      fetchHospitals();
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: 'Operation Failed',
        severity: 'error'
      });
    }
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

                  <TableCell>
                    <Switch 
                      checked={!!h.is_active}
                      onChange={() => handleToggle(h.id, !!h.is_active)}
                    />
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirm.open}
        title="Are you sure?"
        description="This action will change the hospital's active status."
        onClose={() => setConfirm({ open: false })}
        onConfirm={onConfirm}
      />

      {/* Snackbar */}
      <Snackbar 
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={toast.severity} 
          variant="filled"
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
