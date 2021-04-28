import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Api } from '../../../api';
import { validateAll, ValidationTest } from '../../../utils/validate';
import { useAlertMessage } from '../../providers/alert-provider';
import { useCommonStyles } from '../common-styles';
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
    const commonClasses = useCommonStyles();
    const alert = useAlertMessage();
    const history = useHistory();
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
                setNewUser(data);
            })
            .catch((error: AxiosError) => alert.addMessage(error.message));

        Api.Plan.getPlans()
            .then(({ data }) => {
                setPlans(data);
            })
            .catch((error: AxiosError) => alert.addMessage(error.message));
    }, [])

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
                    history.push(`/`);
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

    const handleChangePlanId = (event: React.ChangeEvent<{ value: unknown }>) => {
        const { value } = event.target;
        setNewUser(newUser => ({
            ...newUser,
            planId: Number(value as string),
        }));
    };

    return (
        <Grid container justify="center">
            <Grid item md={10} lg={7} xl={5}>
                <Paper className={commonClasses.paper}>
                    <Box mb={2}>
                        <Typography variant="h4">Create User</Typography>
                        <p>To be able to access your daily tracking you must first register.</p>
                    </Box>
                    <form noValidate autoComplete="off">
                        <Grid container justify="center" alignItems="stretch" spacing={2}>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <TextField error={showErrors && hasErrors('firstName')} label="First Name" id="firstName" name="firstName" value={newUser.firstName} onChange={onChangeStringField} disabled={postingNewUser} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="firstName" results={results} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <TextField error={showErrors && hasErrors('lastName')} label="Last Name" id="lastName" name="lastName" value={newUser.lastName} onChange={onChangeStringField} disabled={postingNewUser} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="lastName" results={results} />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField error={showErrors && hasErrors('emailAddress')} label="Last Name" id="emailAddress" name="emailAddress" value={newUser.emailAddress} disabled={postingNewUser} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="emailAddress" results={results} />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
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

                            <Grid item xs={12}>
                                <em>* Required fields.</em>
                            </Grid>
                        </Grid>
                    </form>

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Box display="flex" alignItems="center">
                            <Box mr={1}>
                                <Button color="primary" onClick={createNewUser} disabled={postingNewUser}>Create</Button>
                                {postingNewUser && <CircularProgress size={24} className={commonClasses.buttonProgress}></CircularProgress>}
                            </Box>
                            <Link to="/plans" className={commonClasses.link}>
                                <Button color="secondary" disabled={postingNewUser}>Cancel</Button>
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid >
    );
}