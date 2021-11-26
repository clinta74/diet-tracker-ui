import React from 'react';
import clsx from 'clsx';
import {
    Box,
    Modal,
    Paper,
    Theme,
    Typography
} from '@mui/material';

import { LineChart } from 'react-chartkick'
import 'chartkick/chart.js'

import { useCommonStyles } from '../common-styles';
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        graphModal: {
            position: 'absolute',
            top: theme.spacing(2),
            left: theme.spacing(2),
            width: `calc(100% - ${theme.spacing(4)})`,
        }
    })
);

interface GraphModalProps {
    open: boolean;
    onClose?: {
        bivarianceHack(event: unknown, reason: 'backdropClick' | 'escapeKeyDown'): void;
    }['bivarianceHack'];
    values?: GraphValue[];
    name?: string;
    title?: string;
}

export const GraphModal: React.FC<GraphModalProps> = ({ open, onClose, values, name, title }) => {
    const commonClasses = useCommonStyles();
    const classes = useStyles();

    const data: {[key: string]: number} = {};
    values && values.forEach(v => data[v.date] = v.value) 

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="graph-modal-title">
            <Paper className={clsx(commonClasses.paper, classes.graphModal)}>
                <Box mb={2}>
                    <Typography variant="h6" id="graph-modal-title">{title}</Typography>
                </Box>

                <Box>
                    <LineChart id={name} data={data} min={null} max={null} />
                </Box>
            </Paper>
        </Modal>
    );
}