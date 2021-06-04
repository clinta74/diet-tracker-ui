import React from 'react';
import {
    Box,
    Button,
    Divider,
    Fab,
    FormControl,
    Grid,
    InputLabel,
    List,
    ListItem,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';


import { useCommonStyles } from '../../common-styles';
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

    const onChangeTrackingValueTypeValue = (event: React.ChangeEvent<{ value: unknown }>, idx: number) => {
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
        console.log('Add Tracking');
    }

    return (
        <Box my={2}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <TextField
                            label="Name"
                            autoComplete="false"
                            autoFocus
                            id="new-tracking-name"
                            type="text"
                            name="name"
                            value={tracking.title}
                            onChange={onChangeTrackingTextValue}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <TextField
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

                <Grid item xs={12}>
                    <Box>
                        <Typography variant="h6">Values</Typography>
                        <Divider className={commonClasses.divider} />
                        <List>
                            {
                                tracking.values &&
                                tracking.values.map(({ name, description, type }, idx) =>
                                    <ListItem key={`value_${idx}`} alignItems="center">
                                        <Box>
                                            <Box>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={8}>
                                                        <FormControl fullWidth>
                                                            <TextField
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
                                                        <FormControl fullWidth>
                                                            <InputLabel id={`tracking-select-type-label-${idx}`}>Type</InputLabel>
                                                            <Select
                                                                labelId={`tracking-select-type-label-${idx}`}
                                                                id={`tracking-select-type-${idx}`}

                                                                value={type}
                                                                onChange={(e) => onChangeTrackingValueTypeValue(e, idx)}
                                                            >
                                                                <MenuItem value="Number">Number</MenuItem>
                                                                <MenuItem value="Boolean">Yes / No </MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth>
                                                            <TextField
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
                                            </Box>
                                            <Box my={2} textAlign="right">
                                                <Button color="secondary">Remove Value</Button>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                )
                            }
                        </List>
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