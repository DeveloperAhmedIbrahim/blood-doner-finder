import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);

      if (response.success && response.data.role === 'admin') {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/dashboard');
      } else {
        setError('You are not authorized as admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h5" align="center" gutterBottom color="#E63946">
            <img src="/icon.png" alt="Logo" width={100} />
            <br />
            One Drop - Admin
            <br />
          </Typography>
          <p style={{textAlign: "center", fontSize:12}}>Please login to access dashabord.</p>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: '#E63946',
                '&:hover': { backgroundColor: '#c82f3a' },
              }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;