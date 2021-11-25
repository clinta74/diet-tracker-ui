import React, { useEffect, useState } from 'react';
import {
    Autocomplete,
    Card,
    CardContent,
    CardHeader,
    createFilterOptions,
    FormControl,
    Grid,
    TextField,
} from '@mui/material';

import { useApi } from '../../../../api';
import { useCommonStyles } from '../../common-styles';

import { useAlertMessage } from '../../../providers/alert-provider';
import { useUserDay } from './user-day-provider';

export const DayFuelings: React.FC = () => {
    const commonClasses = useCommonStyles();
    const alert = useAlertMessage();
    const { Api } = useApi();

    const { userFuelings, setUserFuelings, isPosting } = useUserDay();
    const [fuelings, setFuelings] = useState<Fueling[]>([]);

    useEffect(() => {
        Api.Fueling.getFuelings()
            .then(({ data }) => setFuelings(data.sort((a, b) => a.name > b.name ? 1 : -1)))
            .catch(error => alert.addMessage(error));
    }, []);

    const filter = createFilterOptions<string>();

    // Change handlers
    const onChangeFuelingName = (value: string | null, idx: number) => {
        if (userFuelings[idx].name !== value) {
            setUserFuelings(_userFueling => {
                return [..._userFueling.slice(0, idx),
                {
                    ..._userFueling[idx],
                    name: value || '',
                },
                ..._userFueling.slice(idx + 1)]
            });
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
        });
    }

    return (
        <Card className={commonClasses.card}>
            <CardHeader title="Fuelings" />
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
                                        onInputChange={(e, v) => onChangeFuelingName(v, idx)}
                                        filterOptions={(options, params) => {
                                            params.inputValue = fueling.name;
                                            return filter(options, params);
                                        }}
                                        disabled={isPosting}
                                        renderInput={(params) => (
                                            <TextField autoComplete="off" variant="standard" {...params} name="name" />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={5} sm={4} lg={3}>
                                <FormControl fullWidth className={commonClasses.formControl}>
                                    <TextField type="time" name="when" autoComplete="off" variant="standard" value={when} onChange={e => onChangeFuelingWhen(e, idx)} disabled={isPosting} />
                                </FormControl>
                            </Grid>
                        </Grid>
                    })
                }
            </CardContent>
        </Card>

    );
}
