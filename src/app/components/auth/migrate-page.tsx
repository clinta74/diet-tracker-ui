import React, { useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography, Alert, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../../auth/use-auth';

export const MigratePage: React.FC = () => {
    const { migrateAccount } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        setLoading(true);
        try {
            await migrateAccount(email, newPassword);
            navigate('/');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Migration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" p={4}>
            <Box width="100%" maxWidth={400}>
                <Typography variant="h4" gutterBottom>Set Up Password</Typography>
                <Typography variant="body1" gutterBottom>
                    If you previously signed in with Google or another social provider, enter your email and create a new password.
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        inputProps={{ minLength: 8 }}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    <Box mt={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Set Password & Sign In'}
                        </Button>
                    </Box>
                </form>
                <Box mt={2} textAlign="center">
                    <Link component={RouterLink} to="/login">Back to Sign In</Link>
                </Box>
            </Box>
        </Box>
    );
};
