import { format, parseISO, startOfToday } from 'date-fns';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDebounce } from 'react-use';
import { useApi } from '../../../../api';
import { useAlertMessage } from '../../../providers/alert-provider';

type HasChangedValues = 'userDay' | 'userFuelings' | 'userMeals' | 'victories' | 'trackingValues';

type DispatchWithHasChanged<T> = (action: SetStateAction<T>, markHasChanged?: boolean) => void;

interface UserDayContextValues {
    day: Date;
    dayStr: string;
    userDay?: CurrentUserDay;
    setUserDay: DispatchWithHasChanged<CurrentUserDay | undefined>;

    userFuelings: UserFueling[];
    setUserFuelings: DispatchWithHasChanged<UserFueling[]>;

    userMeals: UserMeal[];
    setUserMeals: DispatchWithHasChanged<UserMeal[]>;

    victories: UserDayVictory[];
    setVictories: DispatchWithHasChanged<UserDayVictory[]>;

    trackingValues: UserDailyTrackingValue[];
    setTrackingValues: DispatchWithHasChanged<UserDailyTrackingValue[]>;

    isLoading: boolean;

    isPosting: boolean;
    setIsPosting: Dispatch<SetStateAction<boolean>>;

    loadValues: () => void;
    saveValues: () => void;

    cancel: () => boolean | null;
}

type Params = Record<'day', string>

export const dateToString = (date: Date) => format(date, 'yyyy-MM-dd');
export const timeout = 2500;

const UserDayContext = React.createContext<UserDayContextValues | null>(null);

export const UserDayProvider: React.FC = ({ children }) => {
    const params = useParams<Params>();
    const [day, setDay] = useState<Date>(startOfToday());

    useEffect(() => {
        const day = params.day ? parseISO(params.day) : startOfToday();
        setDay(day);
    }, [params]);
    
    const { Api } = useApi();
    const alert = useAlertMessage();

    const [userDay, setUserDay] = useState<CurrentUserDay>();

    const [isLoading, setIsLoading] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [hasChanged, setHasChanged] = useState<HasChangedValues[]>([]);

    const [userFuelings, setUserFuelings] = useState<UserFueling[]>([]);
    const [userMeals, setUserMeals] = useState<UserMeal[]>([]);
    const [trackingValues, setTrackingValues] = useState<UserDailyTrackingValue[]>([]);
    const [victories, setVictories] = useState<UserDayVictory[]>([]);

    const dayStr = dateToString(day);

    const [cancel] = useDebounce(() => {
        if (hasChanged.length && !isPosting) {
            console.log('Autosave');
            saveValues();
        }
    }, timeout, [userDay, userFuelings, userMeals, victories, trackingValues]);

    const loadValues = async () => {
        cancel();
        setIsLoading(true);

        try {
            const results = await Promise.all([
                Api.Day.getDay(dayStr),
                Api.Day.getDayFuelings(dayStr),
                Api.Day.getDayMeals(dayStr),
                Api.Day.getDayVictories(dayStr),
                Api.UserDailyTracking.getUserDailyTrackingValues(dayStr)
            ]);

            const [currentUserDay, fuelings, meals, victories, userDailyTracking] = results;

            setUserDay(currentUserDay.data);
            setUserFuelings(fuelings.data);
            setUserMeals(meals.data);
            setVictories(victories.data);
            setTrackingValues(userDailyTracking.data);
        }
        catch (error) {
            alert.addMessage(error);
        }

        setIsLoading(false);
    }

    const saveValues = async () => {
        cancel();
        setHasChanged([]);
        try {
            if (hasChanged.length) {
                if (userDay) {
                    const { data } = await Api.Day.updateDay(dayStr, userDay);
                    setUserDay(_userDay => {
                        return _userDay && {
                            ..._userDay,
                            weightChange: data.weightChange,
                            cumulativeWeightChange: data.cumulativeWeightChange,
                        };
                    });

                    cancel();
                }

                const requests = [];

                if (hasChanged.includes('userFuelings')) {
                    requests.push(async () => {
                        const { data } = await Api.Day.updateDayFuelings(dayStr, userFuelings);
                        setUserFuelings(data);
                    });
                }

                if (hasChanged.includes('userMeals')) {
                    requests.push(async () => { 
                        const { data } = await Api.Day.updateDayMeals(dayStr, userMeals);
                        setUserMeals(data);
                    });
                }

                if (hasChanged.includes('victories')) {
                    requests.push(async () => { 
                        const { data } = await Api.Day.updateDayVictories(dayStr, victories);
                        setVictories(data);
                    });
                }

                if (hasChanged.includes('trackingValues')) {
                    const values = trackingValues.map(({ userTrackingValueId, occurrence, value, when }) => ({
                        userTrackingValueId,
                        occurrence,
                        value,
                        when,
                    }));

                    requests.push(async () => { 
                        await Api.UserDailyTracking.updateUserDailyTrackingValue(dayStr, values);
                    });
                }

                requests.forEach(async fn => await fn());
            }
        }
        catch (error) {
            alert.addMessage(error);
        }
    }

    const withSetHasChanged = <T extends unknown | undefined>(action: Dispatch<SetStateAction<T>>, value: HasChangedValues) => (data: SetStateAction<T>, markHasChanged = true) => {
        action(data);
        markHasChanged && setHasChanged(_ => [..._ || [], value]);
    }

    const userDayContext: UserDayContextValues = {
        day,
        dayStr,
        userDay,
        setUserDay: withSetHasChanged(setUserDay, 'userDay'),
        userFuelings,
        setUserFuelings: withSetHasChanged(setUserFuelings, 'userFuelings'),
        userMeals,
        setUserMeals: withSetHasChanged(setUserMeals, 'userMeals'),
        victories,
        setVictories: withSetHasChanged(setVictories, 'victories'),
        trackingValues,
        setTrackingValues: withSetHasChanged(setTrackingValues, 'trackingValues'),
        isLoading,
        isPosting,
        setIsPosting,
        loadValues,
        saveValues,
        cancel,
    }

    return (
        <React.Fragment>
            <UserDayContext.Provider value={userDayContext}>{children}</UserDayContext.Provider>
        </React.Fragment>
    );
}

export const useUserDay = () => {
    const context = React.useContext(UserDayContext)
    if (context === null) throw new Error('useUserDay must be used within a CurrentUserDayProvider.');
    return context;
}