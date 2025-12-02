import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card
      sx={{
        minWidth: 200,
        backgroundColor: color,
        color: 'white',
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2">{title}</Typography>
          </Box>
          <Box fontSize={50}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;