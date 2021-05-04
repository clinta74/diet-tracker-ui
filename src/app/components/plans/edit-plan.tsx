import { Box, Button, CircularProgress, createStyles, FormControl, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Api } from '../../../api';
import { validateAll, ValidationTest } from '../../../utils/validate';
import { useAlertMessage } from '../../providers/alert-provider';
import { useCommonStyles } from '../common-styles';
import { ErrorMessage } from '../error-message';
import { limits } from './limits';
import { validationTests } from './validation-tests';

const useStyles = makeStyles(() =>
    createStyles({
        buttonProgress: {
            position: 'absolute',
            left: '-100%',
            marginTop: -12,
            marginLeft: -12,
        },
    }),
);

interface Params {
    planId: string;
}

export const EditPlan: React.FC = () => {
    const commonClasses = useCommonStyles();
    const classes = useStyles();
    const alert = useAlertMessage();
    const history = useHistory();
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
                    history.push(`/plans`);
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
        <Grid container justify="center">
            <Grid item md={10} lg={7} xl={5}>
                <Paper className={commonClasses.paper}>
                    <Box mb={2}>
                        <Typography variant="h4">Edit Plan</Typography>
                    </Box>
                    <form noValidate autoComplete="off">
                        <Grid container justify="center" alignItems="stretch" spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField variant="standard" error={showErrors && hasErrors('name')} label="Name" id="name" name="name" value={plan.name} onChange={onChangeStringField} disabled={postingPlan} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="name" results={results} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <TextField variant="standard" error={showErrors && hasErrors('fuelingCount')} type="number" label="Fuelings" id="fuelingCount" name="fuelingCount" value={plan.fuelingCount} onChange={onChangeNumberField} disabled={postingPlan} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="fuelingCount" results={results} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <TextField variant="standard" error={showErrors && hasErrors('mealCount')} type="number" label="Meals" id="mealCount" name="mealCount" value={plan.mealCount} onChange={onChangeNumberField} disabled={postingPlan} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="mealCount" results={results} />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Box display="flex" alignItems="center">
                            <Box mr={1}>
                                <Button color="primary" onClick={savePlan} disabled={postingPlan}>Save</Button>
                                {postingPlan && <CircularProgress size={24} className={classes.buttonProgress}></CircularProgress>}
                            </Box>
                            <Link to="/plans" className={commonClasses.link}>
                                <Button color="secondary" disabled={postingPlan}>Cancel</Button>
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}