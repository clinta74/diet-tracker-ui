import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    TextField,
} from '@mui/material';
import { useCommonStyles } from '../../common-styles';
import { useUserDay } from './user-day-provider';

export const DayMeals: React.FC = () => {
    const commonClasses = useCommonStyles();
    const { userMeals, setUserMeals, isPosting } = useUserDay();

    const onChangeMealName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const { value } = event.target;

        setUserMeals(_userMeals => {
            return [
                ..._userMeals.slice(0, idx),
                {
                    ..._userMeals[idx],
                    name: value || '',
                },
                ..._userMeals.slice(idx + 1)
            ];
        });
    }

    const onChangeMealWhen = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const { value } = event.target;

        setUserMeals(_userMeals => {
            return [..._userMeals.slice(0, idx),
            {
                ..._userMeals[idx],
                when: value ? `0001-01-01T${value}` : null,
            },
            ..._userMeals.slice(idx + 1)]
        });
    }

    return (
        <Card className={commonClasses.card}>
            <CardHeader title="Lean and Green" />
            <CardContent>
                {
                    userMeals.map((meal, idx) => {
                        const when = meal.when === null ? '' : meal.when.split('T')[1];
                        return <Grid container spacing={2} key={`meal_${idx}`}>
                            <Grid item xs={7} sm={8} lg={9}>
                                <FormControl fullWidth >
                                    <TextField 
                                        value={meal.name} 
                                        name="name" 
                                        variant="standard" 
                                        onChange={e => onChangeMealName(e, idx)} 
                                        disabled={isPosting} 
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={5} sm={4} lg={3}>
                                <FormControl fullWidth >
                                    <TextField 
                                        type="time" 
                                        autoComplete="false" 
                                        variant="standard" 
                                        value={when} 
                                        name="when" 
                                        onChange={e => onChangeMealWhen(e, idx)} 
                                        disabled={isPosting}
                                        inputProps={{
                                            step: 300
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    }
                    )
                }
            </CardContent>
        </Card>
    );
}