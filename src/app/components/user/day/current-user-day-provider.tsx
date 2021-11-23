import { format } from 'date-fns';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useDebounce } from 'react-use';
import { useApi } from '../../../../api';
import { useAlertMessage } from '../../../providers/alert-provider';

interface UserDayContextValues {
    currentUserDay?: CurrentUserDay;
    setCurrentUserDay: Dispatch<SetStateAction<CurrentUserDay | undefined>>;

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
    loadValues: (day: Date) => void;
    saveValues: () => void;
}

export const dateToString = (date: Date) => format(date, 'yyyy-MM-dd');
export const timeout = 2000;

const UserDayContext = React.createContext<UserDayContextValues | null>(null);

interface CurrentUserDayProviderProps {
    day: Date;
}

export const CurrentUserDayProvider: React.FC<CurrentUserDayProviderProps> = ({ day }) => {
    const { Api } = useApi();
    const alert = useAlertMessage();

    const [currentUserDay, setCurrentUserDay] = useState<CurrentUserDay>();
    const [hasChanged, setHasChanged] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    const [userFuelings, setUserFuelings] = useState<UserFueling[]>([]);
    const [userMeals, setUserMeals] = useState<UserMeal[]>([]);
    const [trackingValues, setTrackingValues] = useState<UserDailyTrackingValue[]>([]);
    const [victories, setVictories] = useState<UserDayVictory[]>([]);

    const [cancel] = useDebounce(() => {
        if (currentUserDay && hasChanged) {
            saveValues();
        }
    }, timeout, [currentUserDay]);

    const loadValues = async () => {
        cancel();
        setIsLoading(true);
        const dayStr = dateToString(day);

        try {
            var results = await Promise.all([
                Api.Day.getDay(dayStr),
                Api.Day.getDayFuelings(dayStr),
                Api.Day.getDayMeals(dayStr),
                Api.Day.getDayVictories(dayStr),
                Api.UserDailyTracking.getUserDailyTrackingValues(dayStr)
            ]);

            const [currentUserDay, fuelings, meals, victories, userDailyTracking] = results;

            setCurrentUserDay(currentUserDay.data);
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
        try {
            if (currentUserDay) {
                setHasChanged(false);
                const { data } = await Api.Day.updateDay(dateToString(day), currentUserDay);
                setCurrentUserDay(_currenntUserDay => {
                    return _currenntUserDay && {
                        ..._currenntUserDay,
                        weightChange: data.weightChange,
                        cumulativeWeightChange: data.cumulativeWeightChange,
                    };
                });
                cancel();
                const values = trackingValues.map(({ userTrackingValueId, occurrence, value, when }) => ({
                    userTrackingValueId,
                    occurrence,
                    value,
                    when,
                }));
                await Api.UserDailyTracking.updateUserDailyTrackingValue(dateToString(day), values);
            }
        }
        catch (error) {
            alert.addMessage(error);
        }
    }

    const userDayContext: UserDayContextValues = {
        currentUserDay,
        setCurrentUserDay,
        userFuelings,
        setUserFuelings,
        userMeals,
        setUserMeals,
        victories,
        setVictories,
        trackingValues,
        setTrackingValues,
        isLoading,
        isPosting,
        loadValues,
        saveValues,
    }

    return (
        <React.Fragment>
            <UserDayContext.Provider value={userDayContext} />
        </React.Fragment>
    );
}

export const useUserDay = () => {
    const context = React.useContext(UserDayContext)
    if (context === null) throw new Error('useUserDay must be used within a CurrentUserDayProvider.');
    return context;
}