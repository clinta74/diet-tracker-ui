import React from 'react';
import clsx from 'clsx';
import {
    Box,
    createStyles,
    makeStyles,
    Modal,
    Paper,
    Theme,
    Typography
} from '@material-ui/core';
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    LineSeries,
    Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import { useCommonStyles } from '../common-styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        graphModal: {
            position: 'absolute',
            top: theme.spacing(2),
            left: theme.spacing(2),
            width: `calc(100% - ${theme.spacing(4)}px)`,
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

export const GraphModal: React.FC<GraphModalProps> = ({ open, onClose, values: data, name, title }) => {
    const commonClasses = useCommonStyles();
    const classes = useStyles();

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="graph-modal-title">
            <Paper className={clsx(commonClasses.paper, classes.graphModal)}>
                <Box mb={2}>
                    <Typography variant="h6" id="graph-modal-title">{title}</Typography>
                </Box>

                <Box>
                    <Chart data={data}>
                        <ArgumentAxis />
                        <ValueAxis />
                        <LineSeries
                            name={name}
                            valueField="value"
                            argumentField="date"
                        />
                        <Tooltip />
                    </Chart>
                </Box>
            </Paper>
        </Modal>
    );
}