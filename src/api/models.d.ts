interface Fueling {
    fuelingId: number;
    name: string;
}
interface Plan {
    planId: number;
    name: string;
    fuelingCount: number;
    mealCount: number;
    userPlans: UserPlan[];
}
interface User {
    userId: string;
    fristName: string;
    lastName: string;
    emailAddress: string;
    planId: number;
    lastLogin: string;
    userDays: UserDay[];
    userFuelings: UserFueling[];
    userMeals: UserMeal[];
    userPlans: UserPlan[];
}
interface UserDay {
    userId: string;
    day: string;
    water: number;
    weight: number;
    condiments: number;
    user: User;
}
interface UserFueling {
    userFuelingId: number;
    userId: string;
    name: string;
    when: string;
    user: User;
}
interface UserMeal {
    userMealId: number;
    userId: string;
    name: string;
    calories: number;
    user: User;
}
interface UserPlan {
    userId: string;
    planId: number;
    start: string;
    plan: Plan;
    user: User;
}