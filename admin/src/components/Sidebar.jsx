import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import { Dashboard, People, LocalHospital, Bloodtype, Assignment, Favorite } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Users', icon: <People />, path: '/users' },
  { text: 'Donors', icon: <Bloodtype />, path: '/donors' },
  { text: 'Hospitals', icon: <LocalHospital />, path: '/hospitals' },
  { text: 'Requests', icon: <Assignment />, path: '/requests' },
  { text: 'Donations', icon: <Favorite />, path: '/donations' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg,#0f1724 0%, #102a43 100%)',
          color: '#fff',
          borderRight: '0',
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
          Administrator
        </Typography>
      </Box>

      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => {
          const selected = location.pathname === item.path;
          return (
            <ListItemButton
              component={Link}
              to={item.path}
              key={item.text}
              selected={selected}
              sx={{
                color: selected ? '#fff' : 'rgba(255,255,255,0.8)',
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  borderLeft: '4px solid #1976D2',
                },
                '&:hover': { background: 'rgba(255,255,255,0.03)' },
                py: 1.5,
              }}
            >
              <ListItemIcon sx={{ color: selected ? '#1976D2' : 'rgba(255,255,255,0.8)' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
