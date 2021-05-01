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
    lastLogin: string;
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