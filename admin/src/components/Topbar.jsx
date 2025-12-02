import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Avatar, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <AppBar position="fixed" color="inherit" elevation={1} sx={{ ml: '240px', width: `calc(100% - 240px)` }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#1f2937' }}>
          Blood Donor Finder — Admin
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton aria-label="notifications">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={handleOpen} size="small" sx={{ ml: 2 }}>
            <Avatar sx={{ width: 36, height: 36 }}>SA</Avatar>
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>Profile</MenuItem>
            <MenuItem onClick={() => { handleClose(); handleLogout(); }}>
              Logout <LogoutIcon sx={{ ml: 1 }} />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
