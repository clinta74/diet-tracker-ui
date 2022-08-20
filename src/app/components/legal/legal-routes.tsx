import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PrivacyPolicy } from './privacy-policy';

export const LegalRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={< PrivacyPolicy />} />
        </Routes>
    );
}