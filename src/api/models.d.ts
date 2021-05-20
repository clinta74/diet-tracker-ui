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
    userId: UserId;
    fristName: string;
    lastName: string;
    emailAddress: string;
    planId: number;
    created: string;
    userDays?: UserDay[];
    userPlans?: UserPlan[];
}

interface CurrentUser {
    userId: UserId;
    firstName: string;
    lastName: string;
    emailAddress: string;
    lastLogin: string;
    currentPlan: Plan;
    waterTarget: number;
    waterSize: number;
}
interface UserDay {
    userId: UserId;
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
    userId: UserId;
    day: string;
    name: string;
    when: string;
    userDay: UserDay;
}
interface UserMeal {
    userMealId: number;
    userId: UserId;
    day: string;
    name: string;
    when: string;
    userDay: UserDay;
}
interface UserPlan {
    userId: UserId;
    planId: number;
    start: string;
    plan?: Plan;
    user: User;
}
interface NewUser {
    userId: UserId;
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
    userId: UserId;
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

interface UserTrackingRequest {
    name: string;
    description: string;
    occurrences: number;
    type: UserTrackingType;
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

interface CurrentUserDailyTracking {
    userId: UserId;
    day: string;
    value: number;
    when: string;
    occurance: number;
    userTrackingId: number;
    name: string;
    description: string;
}

enum UserTrackingType
{
    Number = 'Number',
    Boolean = 'Boolean',
}

type UserId = string;