import React, { useEffect, useImperativeHandle, useState } from 'react';
import {
    Autocomplete,
    Box,
    Card,
    CardContent,
    CardHeader, CircularProgress, createFilterOptions, FormControl, Grid, TextField,
} from '@mui/material';

import { useApi } from '../../../../api';
import { useCommonStyles } from '../../common-styles';

import { useAlertMessage } from '../../../providers/alert-provider';
import { dateToString, Ref, timeout } from './day-view';
import { useDebounce } from 'react-use';

interface DayFuelingsProps {
    day: Date;
}

const DayFuelingsRender: React.ForwardRefRenderFunction<Ref, DayFuelingsProps> = (({ day }, ref) => {
    const commonClasses = useCommonStyles();
    const alert = useAlertMessage();
    const { Api } = useApi();
    const [fuelings, setFuelings] = useState<Fueling[]>([]);
    const [userFuelings, setUserFuelings] = useState<UserFueling[]>([]);
    const [posting, setPosting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);

    useEffect(() => {
        Api.Fueling.getFuelings()
            .then(({ data }) => setFuelings(data.sort((a, b) => a.name > b.name ? 1 : -1)))
            .catch(error => alert.addMessage(error));
    }, []);

    useEffect(() => {
        loadValues();
    }, [day]);

    const [cancel] = useDebounce(() => {
        if (hasChanged) {
            console.log('Autosave Fuelings', new Date());
            saveValues();
        }
    }, timeout, [userFuelings]);

    const loadValues = () => {
        setIsLoading(true);
        cancel();
        Api.Day.getDayFuelings(dateToString(day))
            .then(({ data }) => setUserFuelings(data))
            .catch(error => alert.addMessage(error))
            .finally(() => {
                setIsLoading(false);
            });
    }

    const saveValues = async () => {
        try {
            setHasChanged(false);
            await Api.Day.updateDayFuelings(dateToString(day), userFuelings);
            cancel();
        }
        catch (error) {
            alert.addMessage(error);
        }
    }

    const save = async () => {
        if (hasChanged) {
            cancel();
            setPosting(true);
            try {
                await saveValues();
            }
            catch (error) {
                alert.addMessage(error);
            }
            finally {
                setPosting(false);
            }
        }
    }

    const add = () => {
        setUserFuelings(_userFuelings => {
            return [
                ..._userFuelings,
                {
                    userId: '',
                    userFuelingId: 0,
                    name: '',
                    day: dateToString(day),
                    when: null
                }
            ];
        });
    }

    useImperativeHandle(ref, () => ({
        save, 
        add,
    }));

    const filter = createFilterOptions<string>();

    // Change handlers
    const onChangeFuelingName = (event: React.ChangeEvent<unknown>, value: string | null, idx: number) => {
        if (userFuelings[idx].name !== value) {
            setUserFuelings(_userFueling => {
                return [..._userFueling.slice(0, idx),
                {
                    ..._userFueling[idx],
                    name: value || '',
                },
                ..._userFueling.slice(idx + 1)]
            }
            );
            setHasChanged(true);
        }
    }

    const onChangeFuelingWhen = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const { value } = event.target;

        setUserFuelings(_userFueling => {
            return [..._userFueling.slice(0, idx),
            {
                ..._userFueling[idx],
                when: value ? `0001-01-01T${value}` : null,
            },
            ..._userFueling.slice(idx + 1)]
        }
        );
        setHasChanged(true);
    }

    return (
        <Card className={commonClasses.card}>
            <CardHeader title="Fuelings" />
            {
                isLoading &&
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <CircularProgress size='3rem' />
                </Box> ||
                <CardContent>
                    {
                        userFuelings.map((fueling, idx) => {
                            const when = fueling.when === null ? '' : fueling.when.split('T')[1];
                            return <Grid container spacing={2} key={`fueling_${idx}`}>
                                <Grid item xs={7} sm={8} lg={9}>
                                    <FormControl fullWidth className={commonClasses.formControl}>
                                        <Autocomplete
                                            freeSolo
                                            options={fuelings.map(fueling => fueling.name)}
                                            value={fueling.name}
                                            onInputChange={(e, v) => onChangeFuelingName(e, v, idx)}
                                            filterOptions={(options, params) => {
                                                params.inputValue = fueling.name;
                                                return filter(options, params);
                                            }}
                                            disabled={posting}
                                            renderInput={(params) => (
                                                <TextField autoComplete="off" variant="standard" {...params} name="name" />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={5} sm={4} lg={3}>
                                    <FormControl fullWidth className={commonClasses.formControl}>
                                        <TextField type="time" name="when" autoComplete="off" variant="standard" value={when} onChange={e => onChangeFuelingWhen(e, idx)} disabled={posting} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        })
                    }
                </CardContent>
            }
        </Card>

    );
});

export const DayFuelings = React.forwardRef(DayFuelingsRender);
