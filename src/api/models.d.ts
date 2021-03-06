type UserId = string;
enum VictoryType {
    NonScale = 'NonScale',
    Goal = 'Goal',
}
enum UserTrackingType {
    Number = 'Number',
    WholeNumber = 'WholeNumber',
    Boolean = 'Boolean',
    Icon = 'Icon',
}

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
    when: string | null;
    userDay?: UserDay;
}
interface UserMeal {
    userMealId: number;
    userId: UserId;
    day: string;
    name: string;
    when: string | null;
    userDay?: UserDay;
}
interface UserPlan {
    userId: UserId;
    planId: number;
    start: string;
    plan?: Plan;
    user: User;
}
interface UserDayFueling {
    userFuelingId: number;
    userId: UserId;
    day: string;
    name: string;
    when: string | null;
}
interface UserDayMeal {
    userMealId: number;
    userId: UserId;
    day: string;
    name: string;
    when: string | null;
}
interface UserDayVictory {
    victoryId: number;
    userId: UserId;
    name: string;
    when: string | null;
    type: VictoryType;
}
interface NewUser {
    userId: UserId;
    firstName: string;
    lastName: string;
    emailAddress: string;
    planId: number;
}
interface CurrentUserDay {
    userId: UserId;
    day: string;
    water: number;
    weight: number;
    user: User;
    notes?: string;
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
interface UserTracking {
    userTrackingId: number;
    userId: UserId;
    disabled: boolean;
    title: string;
    description: string;
    occurrences: number;
    order: number;
    useTime: boolean;
    user?: User;
    values?: UserTrackingValue[];
}
interface UserTrackingValue {
    userTrackingValueId: number;
    userTrackingId: number;
    name: string;
    description: string;
    type: UserTrackingType;
    order: number;
    disabled: boolean;
    metadata: Metadata[];
    tracking?: UserTracking;
    dailyTrackingValues?: UserDailyTrackingValue[];
}
interface Metadata {
    userTrackingValueId: number;
    key: string;
    value: string;
}
interface UserTrackingRequest {
    title: string;
    description: string;
    occurrences: number;
    order: number;
    disabled: boolean;
}
interface UserDailyTrackingValue {
    userId: UserId;
    day: string;
    occurrence: number;
    userTrackingValueId: number;
    value: number;
    when: string | null;
}
interface UserDailyTrackingValueRequest {
    occurrence: number;
    userTrackingValueId: number;
    value: number;
    when: string | null;
}

interface GraphValue {
    value: number
    date: string
}