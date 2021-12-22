import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AddPlan } from './add-plan';
import { EditPlan } from './edit-plan';
import { Plans } from './plans';

export const PlanRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="add" element={<AddPlan />} />
            <Route path="edit/:planId" element={<EditPlan />} />
            <Route path="/" element={<Plans />} />
        </Routes>
    );
}