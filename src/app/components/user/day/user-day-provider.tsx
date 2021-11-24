import { format } from 'date-fns';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useDebounce } from 'react-use';
import { useApi } from '../../../../api';
import { useAlertMessage } from '../../../providers/alert-provider';

type HasChangedValues = 'userDay' | 'userFuelings' | 'userMeals' | 'victories' | 'trackingValues';

interface UserDayContextValues {
    day: Date;
    dayStr: string;
    userDay?: CurrentUserDay;
    setUserDay: Dispatch<SetStateAction<CurrentUserDay | undefined>>;

    userFuelings: UserFueling[];
    setUserFuelings: Dispatch<SetStateAction<UserFueling[]>>;

    userMeals: UserMeal[];
    setUserMeals: Dispatch<SetStateAction<UserMeal[]>>;

    victories: UserDayVictory[];
    setVictories: Dispatch<SetStateAction<UserDayVictory[]>>;

    trackingValues: UserDailyTrackingValue[];
    setTrackingValues: Dispatch<SetStateAction<UserDailyTrackingValue[]>>;

    isLoading: boolean;

    isPosting: boolean;
    setIsPosting: Dispatch<SetStateAction<boolean>>;

    loadValues: () => void;
    saveValues: () => void;

    cancel: () => boolean | null;
}

export const dateToString = (date: Date) => format(date, 'yyyy-MM-dd');
export const timeout = 2000;

const UserDayContext = React.createContext<UserDayContextValues | null>(null);

interface UserDayProviderProps {
    day: Date;
}

export const UserDayProvider: React.FC<UserDayProviderProps> = ({ day, children }) => {
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
        if (hasChanged.length) {
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
            if (userDay && hasChanged.length) {

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

            hasChanged.includes('userFuelings') && await Api.Day.updateDayFuelings(dayStr, userFuelings);
            hasChanged.includes('userMeals') && await Api.Day.updateDayMeals(dayStr, userMeals);
            hasChanged.includes('victories') && await Api.Day.updateDayVictories(dayStr, victories);

            const values = trackingValues.map(({ userTrackingValueId, occurrence, value, when }) => ({
                userTrackingValueId,
                occurrence,
                value,
                when,
            }));
            hasChanged.includes('trackingValues') && await Api.UserDailyTracking.updateUserDailyTrackingValue(dayStr, values);
        }
        catch (error) {
            alert.addMessage(error);
        }
    }

    const withSetHasChanged = <T extends unknown | undefined>(action: Dispatch<SetStateAction<T>>, value: HasChangedValues) => (data: SetStateAction<T>) => {
        action(data);
        setHasChanged(_ => [..._, value]);
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