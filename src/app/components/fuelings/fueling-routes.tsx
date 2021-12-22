import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Fuelings } from './fuelings';

export const FuelingRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Fuelings />} />
        </Routes>
    );
}