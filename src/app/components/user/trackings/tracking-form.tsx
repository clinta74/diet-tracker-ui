import React from 'react';
import {
    Box,
    Button,
    Divider,
    Fab,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UserTrackingType } from '../../../../api/endpoints/user-tracking';


import { useCommonStyles } from '../../common-styles';
import { IconTracking, NullTracking } from './metadata/icon-tracking';
interface TrackingFormProps {
    tracking: UserTracking;
    setTracking: React.Dispatch<React.SetStateAction<UserTracking>>;
}

export const TrackingForm: React.FC<TrackingFormProps> = ({ tracking, setTracking }) => {
    const commonClasses = useCommonStyles();

    const onChangeTrackingTextValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value, name } = event.target;
        setTracking(tracking => ({
            ...tracking,
            [name]: value,
        }));
    }

    const onChangeTrackingNumericValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value, name } = event.target;
        const num = Math.max(0, Number(value));

        setTracking(tracking => ({
            ...tracking,
            [name]: num,
        }));
    }

    const onChangeTrackingCheckedValue = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setTracking(tracking => ({
            ...tracking,
            disabled: checked,
        }));
    }

    const onChangeUseTimeCheckedValue = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setTracking(tracking => ({
            ...tracking,
            useTime: checked,
        }));
    }

    const onChangeTrackingValueTextValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const { value, name } = event.target;

        if (tracking.values) {
            const values = [
                ...tracking.values.slice(0, idx), {
                    ...tracking.values[idx],
                    [name]: value
                },
                ...tracking.values.slice(idx + 1)
            ]

            setTracking(tracking => ({
                ...tracking,
                values,
            }));
        }

    }

    const onChangeTrackingValueTypeValue = (event: SelectChangeEvent, idx: number) => {
        const type = event.target.value as UserTrackingType;
        if (tracking.values) {

            const values = [
                ...tracking.values.slice(0, idx), {
                    ...tracking.values[idx],
                    type
                },
                ...tracking.values.slice(idx + 1)
            ]

            setTracking(tracking => ({
                ...tracking,
                values
            }));
        }
    };

    const onClickAddTracking = () => {
        const defaultValue = {
            userTrackingValueId: 0,
            userTrackingId: 0,
            name: '',
            description: '',
            order: tracking.values ? tracking.values.length + 1 : 1,
            type: UserTrackingType.Number,
            disabled: false,
            metadata: [],
        }

        if (tracking.values) {
            const values = [
                ...tracking.values,
                defaultValue,
            ]

            setTracking(tracking => ({
                ...tracking,
                values,
            }));
        }
        else {
            setTracking(tracking => ({
                ...tracking,
                values: [defaultValue],
            }));
        }
    }

    const onClickRemoveTracking = (event: React.MouseEvent, idx: number) => {
        if (tracking.values) {

            const values = [
                ...tracking.values.slice(0, idx),
                ...tracking.values.slice(idx + 1)
            ]

            setTracking(tracking => ({
                ...tracking,
                values
            }));
        }
    }

    const onChangeMetadata = (metadata: Metadata[], idx: number) => {
        if (tracking.values) {
            const values = [
                ...tracking.values.slice(0, idx), {
                    ...tracking.values[idx],
                    metadata
                },
                ...tracking.values.slice(idx + 1)
            ]

            setTracking(tracking => ({
                ...tracking,
                values
            }));
        }
    }

    const metadataComponent = {
        [UserTrackingType.Icon]: IconTracking,
        [UserTrackingType.Number]: NullTracking,
        [UserTrackingType.WholeNumber]: NullTracking,
        [UserTrackingType.Boolean]: NullTracking,
    }


    return (
        <Box my={2}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <TextField
                            variant="standard"
                            label="Title"
                            autoComplete="false"
                            autoFocus
                            id="new-tracking-name"
                            type="text"
                            name="title"
                            value={tracking.title}
                            onChange={onChangeTrackingTextValue}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <TextField
                            variant="standard"
                            label="Description"
                            autoComplete="false"
                            id="new-tracking-description"
                            type="text"
                            name="description"
                            value={tracking.description}
                            onChange={onChangeTrackingTextValue}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={6} md={2}>
                    <FormControl fullWidth>
                        <TextField
                            variant="standard"
                            label="Times per Day"
                            autoComplete="false"
                            id="new-tracking-occurrences"
                            type="number"
                            name="occurrences"
                            value={tracking.occurrences ? tracking.occurrences : ''}
                            onChange={onChangeTrackingNumericValue}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={4}>
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={tracking.disabled}
                                    onChange={onChangeTrackingCheckedValue}
                                    name="disabled"
                                    color="primary"
                                />
                            }
                            label="Disabled"
                        />
                        <FormHelperText>Disable this tracking so it will no longer show on your day view.</FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item xs={6} md={8}>
                    <FormControl fullWidth>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={tracking.useTime}
                                    onChange={onChangeUseTimeCheckedValue}
                                    name="useTime"
                                    color="primary"
                                />
                            }
                            label="When"
                        />
                        <FormHelperText>Make time option available for some tracking types.</FormHelperText>
                    </FormControl>
                </Grid>

                <Grid item xs={6} md={12}>
                    <Box>
                        <Typography variant="h6">Values</Typography>
                        <Divider className={commonClasses.divider} />
                        <Grid container spacing={2}>
                            {
                                tracking.values &&
                                tracking.values.map(({ name, description, type, metadata, userTrackingValueId }, idx) =>
                                    <Grid item key={`value_${idx}`} xs={12} sm={6}>
                                        <Box marginTop={2}>
                                            <Box>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={8}>
                                                        <FormControl fullWidth>
                                                            <TextField
                                                                variant="standard"
                                                                label="Name"
                                                                autoComplete="false"
                                                                id={`new-tracking-value-name-${idx}`}
                                                                type="text"
                                                                name="name"
                                                                value={name}
                                                                onChange={e => onChangeTrackingValueTextValue(e, idx)}
                                                            />
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12} sm={4}>
                                                        <FormControl variant="standard" fullWidth>
                                                            <InputLabel id={`tracking-select-type-label-${idx}`}>Type</InputLabel>
                                                            <Select
                                                                labelId={`tracking-select-type-label-${idx}`}
                                                                id={`tracking-select-type-${idx}`}

                                                                value={type}
                                                                onChange={(e) => onChangeTrackingValueTypeValue(e, idx)}
                                                            >
                                                                <MenuItem value="Number">Number</MenuItem>
                                                                <MenuItem value="WholeNumber">Whole Number</MenuItem>
                                                                <MenuItem value="Boolean">Yes / No</MenuItem>
                                                                <MenuItem value="Icon">Icon</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth>
                                                            <TextField
                                                                variant="standard"
                                                                label="Description"
                                                                autoComplete="false"
                                                                id={`new-tracking-value-desc-${idx}`}
                                                                type="text"
                                                                name="description"
                                                                value={description}
                                                                onChange={e => onChangeTrackingValueTextValue(e, idx)}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                                <Box my={2}>
                                                    {metadataComponent[type]({ metadata, userTrackingValueId, onChange: onChangeMetadata, idx })}
                                                </Box>

                                            </Box>
                                            {
                                                idx > 0 &&
                                                <Box my={2} textAlign="right">
                                                    <Button color="secondary" onClick={(e => onClickRemoveTracking(e, idx))}>Remove Value</Button>
                                                </Box>
                                            }
                                        </Box>
                                    </Grid>
                                )
                            }
                        </Grid>
                    </Box>
                </Grid>
            </Grid>

            <Box textAlign="right">
                <Fab color="primary" title="Add Tracking Value" aria-label="add" onClick={onClickAddTracking}>
                    <AddIcon />
                </Fab>
            </Box>
        </Box>
    );
}