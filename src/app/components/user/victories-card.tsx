import {
    Card,
    CardContent,
    CardHeader,
    FormControl,
    TextField,
    Theme
} from '@mui/material';
import React from 'react';

interface VictoriesProps {
    victories: Victory[];
    disable: boolean;
    onChange: (values: Victory[]) => void;
}

export const VictoriesCard: React.FC<VictoriesProps> = ({ victories, disable, onChange }) => {

    const onChangeName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const { value } = event.target;
        onChange([
            ...victories.slice(0, idx),
            {
                ...victories[idx],
                name: value,
            },
            ...victories.slice(idx + 1)
        ]);
    }


    return (
        <React.Fragment>
            <Card sx={{ mt: 1 }}>
                <CardHeader title="Victories" subheader="Personal victories for today."></CardHeader>
                <CardContent>
                    {
                        victories.map(({ name }, idx) => {

                            return (
                                <FormControl key={`victory-name-${idx}`} fullWidth>
                                    <TextField variant="standard" value={name} name="name" label="Victory" onChange={e => onChangeName(e, idx)} disabled={disable} />
                                </FormControl>
                            );
                        })
                    }
                </CardContent>
            </Card>
        </React.Fragment>
    );
}