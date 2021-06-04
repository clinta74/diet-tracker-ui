import {
    Box,
    Button,
    CircularProgress,
    createStyles,
    FormControl,
    Grid,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../../../../api';
import { useAlertMessage } from '../../../providers/alert-provider';
import { useCommonStyles } from '../../common-styles';
import { TrackingForm } from './tracking-form';

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
    userTrackingId: string;
}

export const EditTracking: React.FC = () => {
    const classes = useStyles();
    const commonClasses = useCommonStyles();
    const params = useParams<Params>();
    const { Api } = useApi();
    const alert = useAlertMessage();

    const [tracking, setTracking] = useState<UserTracking>();
    const [ postingJob, setPostingJob] = useState(false);

    useEffect(() => {
        const userTrackingId = Number(params.userTrackingId)
        Api.UserTracking.getUserTracking(userTrackingId)
            .then(({data}) => setTracking(data))
            .catch(error => alert.addMessage(error));
    }, [params]);

    const onClickSaveTracking = () => {
        console.log('Save');
    }

    return (
        <Paper>
            {
                tracking &&
                <React.Fragment>
                    <TrackingForm tracking={tracking} setTracking={setTracking as React.Dispatch<React.SetStateAction<UserTracking>>} />
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Box display="flex" alignItems="center">
                            <Box mr={1}>
                                <Button color="primary" onClick={onClickSaveTracking} disabled={postingJob}>Create</Button>
                                {postingJob && <CircularProgress size={24} className={classes.buttonProgress}></CircularProgress>}
                            </Box>
                            <Link to="/trackins" className={commonClasses.link}>
                                <Button color="secondary" disabled={postingJob}>Cancel</Button>
                            </Link>
                        </Box>
                    </Box>
                </React.Fragment>
            }
        </Paper>
    );
}