import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../../api';
import { validateAll, ValidationTest } from '../../../utils/validate';
import { useAlertMessage } from '../../providers/alert-provider';
import { commonSx, plainLinkStyle } from '../common-styles';
import { ErrorMessage } from '../error-message';

const validationTests: ValidationTest<NewUser>[] =
    [
        {
            passCondition: ({ firstName }) => firstName.trim().length > 0,
            result: {
                message: 'A first name is required.',
                name: 'firstName',
            }
        },
        {
            passCondition: ({ lastName }) => lastName.trim().length > 0,
            result: {
                message: 'A last name is required.',
                name: 'lastName',
            }
        },
        {
            passCondition: ({ emailAddress }) => emailAddress.trim().length > 0,
            result: {
                message: 'A email address is required.',
                name: 'emailAddress',
            }
        },
        {
            passCondition: ({ planId }) => planId > 0,
            result: {
                message: 'You must select a plan.',
                name: 'planId',
            }
        },
    ];

export const NewUser: React.FC = () => {
    const alert = useAlertMessage();
    const navigate = useNavigate();
    const { Api } = useApi();

    const [newUser, setNewUser] = useState<NewUser>({
        userId: '',
        firstName: '',
        lastName: '',
        planId: 0,
        emailAddress: '',
    });
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [postingNewUser, setPostingNewUser] = useState(false);

    useEffect(() => {
        Api.NewUser.getNewUser()
            .then(({ data }) => {
                setNewUser({
                    ...data,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    emailAddress: data.emailAddress || '',
                });
            })
            .catch(error=> alert.addMessage(error));

        Api.Plan.getPlans()
            .then(({ data }) => {
                setPlans(data);
            })
            .catch(error => alert.addMessage(error));
    }, []);

    const onChangeStringField: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { name, value } = event.target;

        setNewUser(user => ({
            ...user,
            [name]: value
        }));
    }

    const createNewUser = () => {
        const [valid] = validateAll(validationTests, newUser);
        setIsSubmitted(true);
        if (!postingNewUser && valid) {
            setPostingNewUser(true);
            Api.NewUser.addNewUser(newUser)
                .then(() => {
                    navigate(`/`);
                })
                .catch((error: AxiosError) =>  {
                    alert.addMessage(error.message)
                    setPostingNewUser(false);
                });
        }
    }

    const [isValid, results] = validateAll(validationTests, newUser);
    const showErrors = isSubmitted && !isValid;

    const hasErrors = (inputName: keyof NewUser) => results
        .filter(({ name }) => inputName === name)
        .length > 0;

    const handleChangePlanId = (event: SelectChangeEvent<number>) => {
        const { value } = event.target;
        setNewUser(newUser => ({
            ...newUser,
            planId: Number(value),
        }));
    };

    return (
        <Grid container sx={{
            justifyContent: "center"
        }}>
            <Grid
                size={{
                    xs: 12,
                    md: 10,
                    xl: 8
                }}>
                <Paper sx={commonSx.paper}>
                    <Box sx={{
                        mb: 2
                    }}>
                        <Typography variant="h4">Create User</Typography>
                        <p>To be able to access your daily tracking you must first register.</p>
                    </Box>
                    <form noValidate autoComplete="off">
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                justifyContent: "center",
                                alignItems: "stretch"
                            }}>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <TextField error={showErrors && hasErrors('firstName')} label="First Name" id="firstName" name="firstName" value={newUser.firstName} onChange={onChangeStringField} disabled={postingNewUser} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="firstName" results={results} />
                                </FormControl>
                            </Grid>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <TextField error={showErrors && hasErrors('lastName')} label="Last Name" id="lastName" name="lastName" value={newUser.lastName} onChange={onChangeStringField} disabled={postingNewUser} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="lastName" results={results} />
                                </FormControl>
                            </Grid>

                            <Grid size={12}>
                                <FormControl fullWidth>
                                    <TextField error={showErrors && hasErrors('emailAddress')} label="Last Name" id="emailAddress" name="emailAddress" value={newUser.emailAddress} disabled={postingNewUser} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="emailAddress" results={results} />
                                </FormControl>
                            </Grid>

                            <Grid size={12}>
                                <FormControl fullWidth error={showErrors && hasErrors('planId')}>
                                    <InputLabel id="plan-label" required>Plan</InputLabel>
                                    <Select
                                        labelId="plan-label"
                                        id="planId"
                                        name="planId"
                                        value={newUser.planId}
                                        onChange={handleChangePlanId}
                                    >
                                        <MenuItem value={0}>
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            plans.map(plan => <MenuItem key={plan.planId} value={plan.planId}>{plan.name} plan</MenuItem>)
                                        }
                                    </Select>
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="planId" results={results} />
                                </FormControl>
                            </Grid>

                            <Grid size={12}>
                                <em>* Required fields.</em>
                            </Grid>
                        </Grid>
                    </form>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 2
                        }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                            <Box sx={{
                                mr: 1
                            }}>
                                <Button color="primary" onClick={createNewUser} disabled={postingNewUser}>Create</Button>
                                {postingNewUser && <CircularProgress size={24} sx={commonSx.buttonProgress}></CircularProgress>}
                            </Box>
                            <Link to="/plans" style={plainLinkStyle}>
                                <Button color="secondary" disabled={postingNewUser}>Cancel</Button>
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid >
    );
}