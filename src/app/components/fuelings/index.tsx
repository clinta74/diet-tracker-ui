import React, { useEffect, useState } from 'react';
import { Api } from '../../../api';

export const Fuelings: React.FC = () => {
    const [ fuelings, setFuelings ] = useState<Fueling[]>();

    useEffect(() => {
        Api.Fueling.getFuelings()
            .then(({data}) => {
                setFuelings(data);
            })
    }, []);

    return (
        <div>Fuelings</div>
    );
}
