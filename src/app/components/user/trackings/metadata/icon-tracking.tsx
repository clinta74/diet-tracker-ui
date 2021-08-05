import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import React from 'react';
import { iconLibrary } from '../../../../icons';

interface IconTrackingProps {
    metadata: Metadata[],
    userTrackingValueId: number,
    idx: number,
    onChange: (value: Metadata[], idx: number) => void;
}

export const IconTracking: React.FC<IconTrackingProps> = ({ metadata, userTrackingValueId, idx, onChange }) => {

    const iconName = metadata.find(m => m.key === 'IconName')?.value || '';
    const count = Number(metadata.find(m => m.key === 'Count')?.value) || 0;

    const onChangeTrackingIconMetadataText = (event: React.ChangeEvent<{ value: unknown }>, key: string) => {
        const _iconName = event.target.value as string;
        onChange([
            ...metadata.filter(m => m.key !== key),
            { key, value: _iconName, userTrackingValueId }
        ], idx);
    }

    const onChangeTrackingIconMetadataNumber = (event: React.ChangeEvent<{ value: unknown }>, key: string) => {
        const num = Number(event.target.value as string);
        const _value = Math.min(Math.max(Math.floor(num), 0), 32).toString();

        onChange([
            ...metadata.filter(m => m.key !== key),
            { key, value: _value, userTrackingValueId }
        ], idx);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                    <InputLabel id={`tracking-icon-select-type-label-${idx}`}>Icon</InputLabel>
                    <Select
                        labelId={`tracking-icon-select-type-label-${idx}`}
                        id={`tracking-icon-select-type-${idx}`}

                        value={iconName}
                        onChange={e => onChangeTrackingIconMetadataText(e, 'IconName')}
                    >
                        <MenuItem value="coffeeCup">
                            <IconMenuItem name="coffeeCup">Coffee Cup</IconMenuItem>
                        </MenuItem>
                        <MenuItem value="checkmark">
                            <IconMenuItem name="checkmark">Checkmark</IconMenuItem>
                        </MenuItem>
                        <MenuItem value="snowflake">
                            <IconMenuItem name="snowflake">Snowflake</IconMenuItem>
                        </MenuItem>
                        <MenuItem value="flag">
                            <IconMenuItem name="flag">Flag</IconMenuItem>
                        </MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                    <TextField
                        label="Name"
                        autoComplete="false"
                        id={`new-tracking-icon-value-name-${idx}`}
                        type="number"
                        name="name"
                        value={count|| ''}
                        onChange={e => onChangeTrackingIconMetadataNumber(e, 'Count')}
                    />
                </FormControl>
            </Grid>
        </Grid>

    );
}

interface IconMenuItemProps {
    name: string;
}

const IconMenuItem: React.FC<IconMenuItemProps> = ({ name, children }) => {
    return (
        <Box display="flex" alignItems="center">
            <Box marginY="-4px">{iconLibrary[name]}</Box>
            <Box ml={1}>{children}</Box>
        </Box>
    );
}

export const NullTracking: React.FC<IconTrackingProps> = () => null;