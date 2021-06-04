import {
    Box,
    Button,
    Fab,
    FormControl,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useTheme
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { UserTrackingType } from '../../../../api/endpoints/user-tracking';

const defaultTracking: UserTracking = {
    userTrackingId: 0,
    userId: '',
    title: '',
    disabled: false,
    description: '',
    occurrences: 0,
    order: 0,
    values: [{
        userTrackingValueId: 0,
        userTrackingId: 0,
        name: '',
        description: '',
        type: UserTrackingType.Number,
        order: 1,
        disabled: false,
    }],
}

export const AddTracking: React.FC = () => {
    const [tracking, setTracking] = useState<UserTracking>();
    
    return (
        <div></div>
    );
}