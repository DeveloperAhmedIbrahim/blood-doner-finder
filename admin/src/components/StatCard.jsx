import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import CountUp from 'react-countup';

export default function StatCard({ title, value, icon, color }) {
  return (
    <Card elevation={3} sx={{ minHeight: 120 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" color="text.secondary">{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              <CountUp end={Number(value || 0)} duration={1.2} />
            </Typography>
          </Box>
          <Box sx={{ fontSize: 44, color: color || '#1976D2' }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
}
