import {
    Box,
    Card,
    CardContent,
    CardHeader,
    createStyles,
    FormControl,
    makeStyles,
    TextField,
    Theme
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        card: {
            margin: theme.spacing(1, 0, 0),
        },
        formControl: {
            marginBottom: theme.spacing(1),
        }
    });
});


interface VictoriesProps {
    victories: Victory[];
    disable: boolean;
    onChange: (values: Victory[]) => void;
}

export const VictoriesCard: React.FC<VictoriesProps> = ({ victories, disable, onChange }) => {
    const classes = useStyles();

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
            <Card className={classes.card}>
                <CardHeader title="Victories" subheader="Personal victories for today."></CardHeader>
                <CardContent>
                    {
                        victories.map(({ name }, idx) => {

                            return (
                                <Box key={`victory-name-${idx}`}>
                                    <FormControl fullWidth className={classes.formControl}>
                                        <TextField value={name} name="name" label="Victory" onChange={e => onChangeName(e, idx)} disabled={disable} />
                                    </FormControl>
                                </Box>
                            );
                        })
                    }
                </CardContent>
            </Card>
        </React.Fragment>
    );
}