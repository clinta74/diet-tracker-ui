import { Button, CircularProgress, SelectChangeEvent } from '@mui/material';
import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useApi } from '../../../api/api-provider';
import { validateAll, ValidationTest } from '../../../utils/validate';
import { useAlertMessage } from '../../providers/alert-provider';
import { useUser } from '../../providers/user-provider';
import { useCommonStyles } from '../common-styles';
import { ErrorMessage } from '../error-message';

const validationTests: ValidationTest<{ planId: number, plans: Plan[] }>[] =
    [
        {
            passCondition: ({ planId, plans }) => plans.map(plan => plan.planId).includes(planId),
            result: {
                message: 'A plan must be selected from the list.',
                name: 'planId',
            }
        }
    ]

export const Plan: React.FC = () => {
    const commonClasses = useCommonStyles();
    const { user, updateUser }= useUser();
    const alert = useAlertMessage();
    const { Api } = useApi();

    const [plans, setPlans] = useState<Plan[]>([]);
    const [planId, setPlanId] = useState<number>(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [postingPlanId, setPostingPlanId] = useState(false);

    useEffect(() => {
        Api.Plan.getPlans()
            .then(({ data }) => {
                setPlans(data);
            })
            .catch(error => alert.addMessage(error));
    }, []);

    useEffect(() => {
        setPlanId(user.currentPlan.planId);
    }, [user]);

    const handleChangePlanId = (event: SelectChangeEvent<number>) => {
        const { value } = event.target;
        setPlanId(Number(value));
    };

    const updatePlan = async () => {
        const [valid] = validateAll(validationTests, { planId, plans });
        setIsSubmitted(true);

        if (!postingPlanId && valid) {
            setPostingPlanId(true);
            Api.Plan.changePlan(planId)
                .then(({ data }) => {
                    setPlanId(data);
                    setPostingPlanId(false);
                    updateUser();
                })
                .catch(error =>  {
                    alert.addMessage(error.message)
                })
                .finally(() => {
                    setPostingPlanId(false);
                    setIsSubmitted(false);
                });
        }
    }

    const [isValid, results] = validateAll(validationTests, { planId, plans });
    const showErrors = isSubmitted && !isValid;

    const hasErrors = results.length > 0;

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} md={10} xl={8}>
                <Paper className={commonClasses.paper}>
                    <Box mb={2}>
                        <Typography variant="h4">Update Your Plan</Typography>
                        <p>Changing your plan will change the number of fuelings and meals you are shown each day going forward.</p>
                    </Box>
                    
                    <form noValidate autoComplete="off">
                        <FormControl fullWidth error={showErrors && hasErrors}>
                            <InputLabel id="plan-label" required>Plan</InputLabel>
                            <Select
                                labelId="plan-label"
                                id="planId"
                                name="planId"
                                value={plans.length > 0 ? planId : 0}
                                onChange={handleChangePlanId}
                            >
                                <MenuItem value={0}>
                                    <em>None</em>
                                </MenuItem>
                                {
                                    plans.map(plan => <MenuItem key={plan.planId} value={plan.planId}>{`${plan.name} plan${plan.planId === user.currentPlan.planId ? ' (current)' : ''}`}</MenuItem>)
                                }
                            </Select>
                            <ErrorMessage isSubmitted={isSubmitted} inputName="planId" results={results} />
                        </FormControl>
                    </form>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Box display="flex" alignItems="center">
                            <Box mr={1}>
                                <Button color="primary" onClick={updatePlan} disabled={postingPlanId || planId === user.currentPlan.planId}>Update</Button>
                                {postingPlanId && <CircularProgress size={24} className={commonClasses.buttonProgress}></CircularProgress>}
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}