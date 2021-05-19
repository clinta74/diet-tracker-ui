interface Fueling {
    fuelingId: number;
    name: string;
}
interface Plan {
    planId: number;
    name: string;
    fuelingCount: number;
    mealCount: number;
    userPlans?: UserPlan[];
}
interface User {
    userId: string;
    fristName: string;
    lastName: string;
    emailAddress: string;
    planId: number;
    created: string;
    userDays?: UserDay[];
    userPlans?: UserPlan[];
}

interface CurrentUser {
    userId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    lastLogin: string;
    currentPlan: Plan;
    waterTarget: number;
    waterSize: number;
}
interface UserDay {
    userId: string;
    day: string;
    water: number;
    weight: number;
    condiments: number;
    user: User;
    fuelings: UserFueling[];
    meals: UserMeal[];
    notes?: string;
}
interface UserFueling {
    userFuelingId: number;
    userId: string;
    day: string;
    name: string;
    when: string;
    userDay: UserDay;
}
interface UserMeal {
    userMealId: number;
    userId: string;
    day: string;
    name: string;
    when: string;
    userDay: UserDay;
}
interface UserPlan {
    userId: string;
    planId: number;
    start: string;
    plan?: Plan;
    user: User;
}
interface NewUser {
    userId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    planId: number;
}
interface CurrentUserDay extends UserDay {
    cumulativeWeightChange: number;
    weightChange: number;
}
interface Victory {
    victoryId: number;
    userId: string;
    name: string;
    when: string | null;
    type: VictoryType;
    user?: User;
}

enum VictoryType {
    NonScale = 'NonScale',
    Goal = 'Goal',
}

interface UserTracking {
    userTrackingId: number;
    userId: UserId;
    removed: boolean;
    name: string;
    description: string;
    occurrences: number;
    type: UserTrackingType;
    user: User;
    trackings: UserDailyTracking[];
}

interface UserDailyTracking {
    userId: UserId;
    day: string;
    userTrackingId: number;
    value: number;
    when: string;
    occurrence: number;
    userDay: UserDay;
    tracking: UserTracking;
}

enum UserTrackingType
{
    Number = 'Number',
    Boolean = 'Boolean',
}

type UserId = string;