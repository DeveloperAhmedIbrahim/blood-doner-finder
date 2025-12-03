import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, IconButton, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline, Block } from "@mui/icons-material";
import { adminAPI } from "../services/api";
import ConfirmDialog from "../components/ConfirmDialog";
import Loader from "../components/Loader";

export default function Users() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState({
    open: false,
    action: null,
    id: null,
  });

  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllUsers();
      if (res.success) setRows(res.data.map((u) => ({ id: u.id, ...u })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleBlock = (id, isActive) => {
    setConfirm({
      open: true,
      action: 'block',
      id,
      isActive,
    });
  };
  const handleDelete = (id) => setConfirm({ open: true, action: "delete", id });

  const onConfirm = async () => {
    const { action, id, isActive } = confirm;
    setConfirm({ open: false });

    try {
      if (action === 'block') {
        // toggle block/unblock
        await adminAPI.blockUser(id, !isActive);
        setToast({
          open: true,
          message: !isActive ? 'User Unblocked Successfully' : 'User Blocked Successfully',
          severity: 'success'
        });
      }

      else if (action === 'delete') {
        await adminAPI.deleteUser(id);
        setToast({
          open: true,
          message: 'User Deleted Successfully',
          severity: 'info'
        });
      }

      fetchUsers();
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: 'Operation Failed',
        severity: 'error'
      });
    }
  };

  const formatDateTime = (dateString) => {
    dateString = "2025-12-01T12:46:36.000Z";
    if (!dateString) return dateString;
    const d = new Date(dateString);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };


  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "role", headerName: "Role", width: 90 },
    { field: "blood_group", headerName: "Blood", width: 70 },

    // ✔ is_verified: convert 0/1 → Yes/No
    {
      field: "is_verified",
      headerName: "Verified",
      width: 100,
      renderCell: (params) =>
        params.value === 1 || params.value === true ? "Yes" : "No",
    },

    // ✔ Format date to Day/Month/Year Hour:Minute
    {
      field: "created_at",
      headerName: "Created",
      width: 140,
      valueFormatter: (params) => formatDateTime(params),
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const isActive = params.row.is_active === 1;
        console.log(params);
        return (
          <>
            <IconButton
              onClick={() => handleBlock(params.row.id, isActive)}
              color={isActive ? 'warning' : 'success'}
            >
              <Block />
            </IconButton>

            <IconButton
              onClick={() => handleDelete(params.row.id)}
              color="error"
            >
              <DeleteOutline />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <Box width="100%">
      <Typography width="100%" variant="h4" gutterBottom>
        All Users
      </Typography>
      <Paper width="100%" sx={{ height: 600, p: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          loading={loading}
        />
      </Paper>

      <ConfirmDialog
        open={confirm.open}
        title="Are you sure?"
        description={`Do you want to ${confirm.action === 'delete' ? 'delete' : (confirm.isActive ? 'block' : 'unblock')} this user?`}
        onClose={() => setConfirm({ open: false })}
        onConfirm={onConfirm}
      />
      <Loader open={loading} />
      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setToast({ ...toast, open: false })} 
          severity={toast.severity} 
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>      
    </Box>
  );
}
