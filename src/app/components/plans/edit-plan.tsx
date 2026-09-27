import { Box, Button, CircularProgress, FormControl, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../../api/api-provider';
import { validateAll } from '../../../utils/validate';
import { useAlertMessage } from '../../providers/alert-provider';
import { commonSx, plainLinkStyle } from '../common-styles';
import { ErrorMessage } from '../error-message';
import { limits } from './limits';
import { validationTests } from './validation-tests';

type Params = Record<'planId', string>

export const EditPlan: React.FC = () => {
    const { Api } = useApi();
    const alert = useAlertMessage();
    const navigate = useNavigate();
    const params = useParams<Params>();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [postingPlan, setPostingPlan] = useState(false);

    const [plan, setPlan] = useState<Plan>({
        name: '',
        fuelingCount: 1,
        mealCount: 1,
        planId: 0,
    });

    useEffect(() => {
        const planId = Number(params.planId);
        if (planId) {
            Api.Plan.getPlan(planId)
                .then(({ data }) => {
                    setPlan(data);
                })
                .catch(error => alert.addMessage(error.message));
        }
    }, [params]);

    const onChangeStringField: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { name, value } = event.target;

        setPlan(plan => ({
            ...plan,
            [name]: value
        }
        ));
    }

    const onChangeNumberField: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { name, value } = event.target;

        const newValue = value === '' ? value : Math.max(limits[name].min, Math.min(limits[name].max, Number(value)));

        setPlan(plan => ({
            ...plan,
            [name]: newValue
        }
        ));
    }

    const savePlan = () => {
        const [valid] = validateAll(validationTests, plan);
        setIsSubmitted(true);
        if (!postingPlan && valid) {
            setPostingPlan(true);
            Api.Plan.updatePlan(plan.planId, plan)
                .then(() => {
                    navigate(`/plans`);
                })
                .catch(error => alert.addMessage(error.message))
                .finally(() => setPostingPlan(false));
        }
    }

    const [isValid, results] = validateAll(validationTests, plan);
    const showErrors = isSubmitted && !isValid;

    const hasErrors = (inputName: keyof Plan) => results
        .filter(({ name }) => inputName === name)
        .length > 0;

    return (
        <Grid container sx={{
            justifyContent: "center"
        }}>
            <Grid
                size={{
                    md: 10,
                    lg: 7,
                    xl: 5
                }}>
                <Paper sx={commonSx.paper}>
                    <Box sx={{
                        mb: 2
                    }}>
                        <Typography variant="h4">Edit Plan</Typography>
                    </Box>
                    <form noValidate autoComplete="off">
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                justifyContent: "center",
                                alignItems: "stretch"
                            }}>
                            <Grid size={12}>
                                <FormControl fullWidth>
                                    <TextField variant="standard" error={showErrors && hasErrors('name')} label="Name" id="name" name="name" value={plan.name} onChange={onChangeStringField} disabled={postingPlan} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="name" results={results} />
                                </FormControl>
                            </Grid>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <TextField variant="standard" error={showErrors && hasErrors('fuelingCount')} type="number" label="Fuelings" id="fuelingCount" name="fuelingCount" value={plan.fuelingCount} onChange={onChangeNumberField} disabled={postingPlan} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="fuelingCount" results={results} />
                                </FormControl>
                            </Grid>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <TextField variant="standard" error={showErrors && hasErrors('mealCount')} type="number" label="Meals" id="mealCount" name="mealCount" value={plan.mealCount} onChange={onChangeNumberField} disabled={postingPlan} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="mealCount" results={results} />
                                </FormControl>
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
                                <Button color="primary" onClick={savePlan} disabled={postingPlan}>Save</Button>
                                {postingPlan && <CircularProgress size={24} sx={commonSx.buttonProgress}></CircularProgress>}
                            </Box>
                            <Link to="/plans" style={plainLinkStyle}>
                                <Button color="secondary" disabled={postingPlan}>Cancel</Button>
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}