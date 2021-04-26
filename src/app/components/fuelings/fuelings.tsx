import React, { useEffect, useState } from 'react';
import { Paper } from '@material-ui/core';
import { Api } from '../../../api';
import { useCommonStyles } from '../common-styles';

export const Fuelings: React.FC = () => {
    const commonClasses = useCommonStyles();
    const [fuelings, setFuelings] = useState<Fueling[]>();

    useEffect(() => {
        Api.Fueling.getFuelings()
            .then(({ data }) => {
                setFuelings(data);
            });
    }, []);

    return (
        <React.Fragment><Paper className={commonClasses.paper}>Fuelings</Paper></React.Fragment>
    );
}