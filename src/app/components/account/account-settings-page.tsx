import React, { useEffect, useState } from 'react';
import {
    Box, Button, CircularProgress, TextField, Typography,
    Alert, Divider, List, ListItem, ListItemText, ListItemSecondaryAction,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useApi } from '../../../api/api-provider';
import { useConfirm } from 'material-ui-confirm';
import { SessionInfo } from '../../../api/endpoints/account';
import { format } from 'date-fns';

export const AccountSettingsPage: React.FC = () => {
    const { Api } = useApi();
    const confirm = useConfirm();

    // Change password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Change email state
    const [newEmail, setNewEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [emailSuccess, setEmailSuccess] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);

    // Sessions state
    const [sessions, setSessions] = useState<SessionInfo[]>([]);
    const [sessionsLoading, setSessionsLoading] = useState(true);

    useEffect(() => {
        Api.Account.getSessions()
            .then(r => setSessions(r.data))
            .catch(() => setSessions([]))
            .finally(() => setSessionsLoading(false));
    }, [Api.Account]);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(false);
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return;
        }
        setPasswordLoading(true);
        try {
            await Api.Account.changePassword(currentPassword, newPassword);
            setPasswordSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: unknown) {
            setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleChangeEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError(null);
        setEmailSuccess(false);
        setEmailLoading(true);
        try {
            await Api.Account.changeEmail(newEmail);
            setEmailSuccess(true);
            setNewEmail('');
        } catch (err: unknown) {
            setEmailError(err instanceof Error ? err.message : 'Failed to change email');
        } finally {
            setEmailLoading(false);
        }
    };

    const handleRevokeSession = async (id: number) => {
        await confirm({ description: 'Revoke this session?' });
        await Api.Account.revokeSession(id);
        setSessions(s => s.filter(x => x.id !== id));
    };

    const handleRevokeAll = async () => {
        await confirm({ description: 'Sign out all other sessions?' });
        await Api.Account.revokeAllSessions();
        setSessions([]);
    };

    return (
        <Box maxWidth={600} mx="auto" p={2}>
            <Typography variant="h4" gutterBottom>Account Settings</Typography>

            <Typography variant="h6" gutterBottom>Change Password</Typography>
            {passwordError && <Alert severity="error" sx={{ mb: 1 }}>{passwordError}</Alert>}
            {passwordSuccess && <Alert severity="success" sx={{ mb: 1 }}>Password updated successfully</Alert>}
            <form onSubmit={handleChangePassword}>
                <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    margin="dense"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    margin="dense"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    inputProps={{ minLength: 8 }}
                />
                <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    margin="dense"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />
                <Box mt={1}>
                    <Button type="submit" variant="contained" disabled={passwordLoading}>
                        {passwordLoading ? <CircularProgress size={20} /> : 'Change Password'}
                    </Button>
                </Box>
            </form>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Change Email</Typography>
            {emailError && <Alert severity="error" sx={{ mb: 1 }}>{emailError}</Alert>}
            {emailSuccess && <Alert severity="success" sx={{ mb: 1 }}>Email updated successfully</Alert>}
            <form onSubmit={handleChangeEmail}>
                <TextField
                    label="New Email"
                    type="email"
                    fullWidth
                    margin="dense"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
                <Box mt={1}>
                    <Button type="submit" variant="contained" disabled={emailLoading}>
                        {emailLoading ? <CircularProgress size={20} /> : 'Change Email'}
                    </Button>
                </Box>
            </form>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6">Active Sessions</Typography>
                {sessions.length > 0 && (
                    <Button variant="outlined" color="warning" size="small" onClick={handleRevokeAll}>
                        Sign Out All
                    </Button>
                )}
            </Box>
            {sessionsLoading ? (
                <CircularProgress size={24} />
            ) : sessions.length === 0 ? (
                <Typography variant="body2" color="textSecondary">No active sessions</Typography>
            ) : (
                <List dense>
                    {sessions.map(session => (
                        <ListItem key={session.id} divider>
                            <ListItemText
                                primary={`Created: ${format(new Date(session.createdAt), 'PPpp')}`}
                                secondary={`Expires: ${format(new Date(session.expiresAt), 'PPpp')}${session.createdByIp ? ` • IP: ${session.createdByIp}` : ''}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleRevokeSession(session.id)} title="Revoke session">
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};
