import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AddPlan } from './add-plan';
import { EditPlan } from './edit-plan';
import { Plans } from './plans';

export const PlanRoutes: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/plans/add" component={AddPlan} />
            <Route exact path="/plans/edit/:planId" component={EditPlan} />
            <Route exact path="/plans" component={Plans} />
        </Switch>
    );
}