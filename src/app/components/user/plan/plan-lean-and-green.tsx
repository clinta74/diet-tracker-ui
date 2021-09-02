import React from 'react';
import {
    Box,
    Button,
    Paper,
    Typography
} from '@material-ui/core';
import { useCommonStyles } from '../../common-styles';
import { NavLink, useParams } from 'react-router-dom';
import { parseISO } from 'date-fns';
import { dateToString } from '../day-view';

interface Params {
    day: string;
    number: string;
}

export const PlanLeanAndGreen: React.FC = () => {
    const params = useParams<Params>();
    const commonClasses = useCommonStyles();

    const { day, planNumber } = {
        day: parseISO(params.day),
        planNumber: Number(params.number),
    }

    console.log('number', planNumber);

    return (
        <Paper className={commonClasses.paper}>
            <Box>
                <Typography variant="h4">Plan your Lean and Green</Typography>
            </Box>
            <Box display="flex">
                <NavLink className={commonClasses.link} to={`/day/${dateToString(day)}`}>
                    <Button color="secondary">Return</Button>
                </NavLink>
            </Box>
        </Paper>

    );
}