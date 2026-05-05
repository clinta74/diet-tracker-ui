import React, { useEffect, useState } from 'react';
import {
    Box, Button, Checkbox, CircularProgress, Chip, FormControlLabel, FormGroup,
    Typography, Alert, Accordion, AccordionSummary, AccordionDetails,
    TextField, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useApi } from '../../../api/api-provider';
import { AdminUserDto } from '../../../api/endpoints/admin';
import { useConfirm } from 'material-ui-confirm';

const ALL_PERMISSIONS = [
    'write:user',
    'write:fuelings',
    'write:plans',
    'write:lean-and-greens',
    'read:user',
    'admin:users',
];

export const AdminUsersPage: React.FC = () => {
    const { Api } = useApi();
    const confirm = useConfirm();
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savingUserId, setSavingUserId] = useState<string | null>(null);

    // Credential set state per user
    const [credentialEmail, setCredentialEmail] = useState<Record<string, string>>({});
    const [credentialPassword, setCredentialPassword] = useState<Record<string, string>>({});
    const [credentialError, setCredentialError] = useState<Record<string, string>>({});
    const [credentialSuccess, setCredentialSuccess] = useState<Record<string, boolean>>({});

    useEffect(() => {
        Api.Admin.getUsers()
            .then(r => setUsers(r.data))
            .catch(() => setError('Failed to load users'))
            .finally(() => setLoading(false));
    }, [Api.Admin]);

    const handlePermissionToggle = (userId: string, permission: string) => {
        setUsers(prev => prev.map(u => {
            if (u.userId !== userId) return u;
            const perms = u.permissions.includes(permission)
                ? u.permissions.filter(p => p !== permission)
                : [...u.permissions, permission];
            return { ...u, permissions: perms };
        }));
    };

    const handleSavePermissions = async (user: AdminUserDto) => {
        setSavingUserId(user.userId);
        try {
            await Api.Admin.setPermissions(user.userId, user.permissions);
        } catch {
            setError(`Failed to save permissions for ${user.firstName} ${user.lastName}`);
        } finally {
            setSavingUserId(null);
        }
    };

    const handleSetCredentials = async (userId: string) => {
        const email = credentialEmail[userId] || '';
        const password = credentialPassword[userId] || '';
        setCredentialError(prev => ({ ...prev, [userId]: '' }));
        setCredentialSuccess(prev => ({ ...prev, [userId]: false }));
        if (!email || !password) {
            setCredentialError(prev => ({ ...prev, [userId]: 'Email and password are required' }));
            return;
        }
        if (password.length < 8) {
            setCredentialError(prev => ({ ...prev, [userId]: 'Password must be at least 8 characters' }));
            return;
        }
        try {
            await Api.Admin.setCredentials(userId, email, password);
            setCredentialSuccess(prev => ({ ...prev, [userId]: true }));
            setCredentialEmail(prev => ({ ...prev, [userId]: '' }));
            setCredentialPassword(prev => ({ ...prev, [userId]: '' }));
            setUsers(prev => prev.map(u => u.userId === userId ? { ...u, hasCredentials: true, email } : u));
        } catch (err: unknown) {
            setCredentialError(prev => ({ ...prev, [userId]: err instanceof Error ? err.message : 'Failed to set credentials' }));
        }
    };

    const handleRevokeSessions = async (user: AdminUserDto) => {
        await confirm({ description: `Sign out all sessions for ${user.firstName} ${user.lastName}?` });
        await Api.Admin.revokeUserSessions(user.userId);
    };

    if (loading) return <Box p={4}><CircularProgress /></Box>;

    return (
        <Box maxWidth={800} mx="auto" p={2}>
            <Typography variant="h4" gutterBottom>User Management</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {users.map(user => (
                <Accordion key={user.userId}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" alignItems="center" gap={1} width="100%">
                            <Typography>{user.firstName} {user.lastName}</Typography>
                            {user.email && <Typography variant="body2" color="textSecondary">({user.email})</Typography>}
                            {!user.hasCredentials && <Chip label="No credentials" color="warning" size="small" />}
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="subtitle2" gutterBottom>Permissions</Typography>
                        <FormGroup row>
                            {ALL_PERMISSIONS.map(perm => (
                                <FormControlLabel
                                    key={perm}
                                    control={
                                        <Checkbox
                                            checked={user.permissions.includes(perm)}
                                            onChange={() => handlePermissionToggle(user.userId, perm)}
                                        />
                                    }
                                    label={perm}
                                />
                            ))}
                        </FormGroup>
                        <Box mt={1} mb={2}>
                            <Button
                                variant="contained"
                                size="small"
                                disabled={savingUserId === user.userId}
                                onClick={() => handleSavePermissions(user)}
                            >
                                {savingUserId === user.userId ? <CircularProgress size={18} /> : 'Save Permissions'}
                            </Button>
                        </Box>

                        <Divider />

                        <Box mt={2}>
                            <Typography variant="subtitle2" gutterBottom>
                                {user.hasCredentials ? 'Update Credentials' : 'Set Credentials'}
                            </Typography>
                            {credentialError[user.userId] && (
                                <Alert severity="error" sx={{ mb: 1 }}>{credentialError[user.userId]}</Alert>
                            )}
                            {credentialSuccess[user.userId] && (
                                <Alert severity="success" sx={{ mb: 1 }}>Credentials set successfully</Alert>
                            )}
                            <Box display="flex" gap={1} flexWrap="wrap">
                                <TextField
                                    label="Email"
                                    type="email"
                                    size="small"
                                    value={credentialEmail[user.userId] || ''}
                                    onChange={e => setCredentialEmail(prev => ({ ...prev, [user.userId]: e.target.value }))}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    size="small"
                                    value={credentialPassword[user.userId] || ''}
                                    onChange={e => setCredentialPassword(prev => ({ ...prev, [user.userId]: e.target.value }))}
                                    inputProps={{ minLength: 8 }}
                                />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleSetCredentials(user.userId)}
                                >
                                    Set Credentials
                                </Button>
                            </Box>
                        </Box>

                        <Box mt={2}>
                            <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                onClick={() => handleRevokeSessions(user)}
                            >
                                Sign Out All Sessions
                            </Button>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};
