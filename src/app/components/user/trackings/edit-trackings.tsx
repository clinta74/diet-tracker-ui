import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../../../api';
import { useAlertMessage } from '../../../providers/alert-provider';
import { commonSx, plainLinkStyle } from '../../common-styles';
import { TrackingForm } from './tracking-form';

type Params = Record<'userTrackingId', string>

export const EditTracking: React.FC = () => {
    const params = useParams<Params>();
    const { Api } = useApi();
    const alert = useAlertMessage();
    const navigate = useNavigate();

    const [tracking, setTracking] = useState<UserTracking>();
    const [postingTracking, setPostingTracking] = useState(false);

    useEffect(() => {
        const userTrackingId = Number(params.userTrackingId)
        Api.UserTracking.getUserTracking(userTrackingId)
            .then(({ data }) => setTracking(data))
            .catch(error => alert.addMessage(error));
    }, [params]);

    const onClickSaveTracking = () => {
        if (tracking) {
            setPostingTracking(true);

            Api.UserTracking.updateUserTracking(tracking.userTrackingId, tracking)
                .then(() => navigate('/trackings'))
                .catch(error => alert.addMessage(error))
                .finally(() => setPostingTracking(false));
        }
    }

    return (
        <Paper sx={commonSx.paper}>
            <Box>
                <Typography variant="h4">Edit Tracking</Typography>
                Please enter the information about the value you would like to track.
            </Box>
            {
                tracking &&
                <React.Fragment>
                    <TrackingForm tracking={tracking} setTracking={setTracking as React.Dispatch<React.SetStateAction<UserTracking>>} />
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
                                <Button color="primary" onClick={onClickSaveTracking} disabled={postingTracking}>Save</Button>
                                {postingTracking && <CircularProgress size={24} sx={commonSx.buttonProgress}></CircularProgress>}
                            </Box>
                            <Link to="/trackings" style={plainLinkStyle}>
                                <Button color="secondary" disabled={postingTracking}>Cancel</Button>
                            </Link>
                        </Box>
                    </Box>
                </React.Fragment>
            }
        </Paper>
    );
}