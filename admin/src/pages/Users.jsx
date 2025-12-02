import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DeleteOutline, Block } from '@mui/icons-material';
import { adminAPI } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';

export default function Users() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, action: null, id: null });
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllUsers();
      if (res.success) setRows(res.data.map(u => ({ id: u.id, ...u })));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleBlock = (id) => setConfirm({ open: true, action: 'block', id });
  const handleDelete = (id) => setConfirm({ open: true, action: 'delete', id });

  const onConfirm = async () => {
    const { action, id } = confirm;
    setConfirm({ open: false });
    try {
      if (action === 'block') {
        await adminAPI.blockUser(id, false); // toggle or set as required by your backend
        alert('User blocked/unblocked');
      } else if (action === 'delete') {
        await adminAPI.deleteUser(id);
        alert('User deleted');
      }
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Operation failed');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'role', headerName: 'Role', width: 110 },
    { field: 'blood_group', headerName: 'Blood', width: 100 },
    { field: 'is_verified', headerName: 'Verified', width: 110, valueGetter: (p) => p.row?.is_verified ? 'Yes' : 'No' },
    { field: 'created_at', headerName: 'Created', width: 160 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleBlock(params.row.id)}><Block /></IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error"><DeleteOutline /></IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>All Users</Typography>
      <Paper sx={{ height: 600, p: 2 }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10,25,50]} loading={loading} />
      </Paper>

      <ConfirmDialog
        open={confirm.open}
        title="Are you sure?"
        description="This action cannot be undone."
        onClose={() => setConfirm({ open: false })}
        onConfirm={onConfirm}
      />
      <Loader open={loading} />
    </Box>
  );
}
