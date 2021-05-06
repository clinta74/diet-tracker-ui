import { 
    Box, 
    Button, 
    CircularProgress, 
    createStyles, 
    FormControl, 
    Grid, 
    makeStyles, 
    Paper, 
    TextField, 
    Typography 
} from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Api } from '../../../api';
import { validateAll } from '../../../utils/validate';
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

export const AddPlan: React.FC = () => {
    const classes = useStyles();
    const commonClasses = useCommonStyles();
    const history = useHistory();
    const alert = useAlertMessage();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [postingJob, setPostingJob] = useState(false);

    const [plan, setPlan] = useState<Plan>({
        name: '',
        fuelingCount: 1,
        mealCount: 1,
        planId: 0,
    });

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

    const createPlan = () => {
        const [valid] = validateAll(validationTests, plan);
        setIsSubmitted(true);
        if (!postingJob && valid) {
            setPostingJob(true);
            Api.Plan.addPlan(plan)
                .then(() => {
                    history.push(`/plans`);
                })
                .catch((error: AxiosError) => alert.addMessage(error.message))
                .finally(() => setPostingJob(false));
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
                        <Typography variant="h4">Create Plan</Typography>
                    </Box>
                    <form noValidate autoComplete="off">
                        <Grid container justify="center" alignItems="stretch" spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField variant="standard" error={showErrors && hasErrors('name')} label="Name" id="name" name="name" value={plan.name} onChange={onChangeStringField} disabled={postingJob} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="name" results={results} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <TextField variant="standard" error={showErrors && hasErrors('fuelingCount')} type="number" label="Fuelings" id="fuelingCount" name="fuelingCount" value={plan.fuelingCount} onChange={onChangeNumberField} disabled={postingJob} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="fuelingCount" results={results} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <TextField variant="standard" error={showErrors && hasErrors('mealCount')} type="number" label="Meals" id="mealCount" name="mealCount" value={plan.mealCount} onChange={onChangeNumberField} disabled={postingJob} required />
                                    <ErrorMessage isSubmitted={isSubmitted} inputName="mealCount" results={results} />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Box display="flex" alignItems="center">
                            <Box mr={1}>
                                <Button color="primary" onClick={createPlan} disabled={postingJob}>Create</Button>
                                {postingJob && <CircularProgress size={24} className={classes.buttonProgress}></CircularProgress>}
                            </Box>
                            <Link to="/plans" className={commonClasses.link}>
                                <Button color="secondary" disabled={postingJob}>Cancel</Button>
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>

    );
}