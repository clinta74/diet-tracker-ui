import {
    Button,
    CircularProgress,
    Input,
    TextField,
    Box,
    FormControl,
    Grid,
    InputLabel,
    Paper,
    Typography
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useApi } from '../../../api/api-provider';
import { validateAll, ValidationTest } from '../../../utils/validate';
import { useAlertMessage } from '../../providers/alert-provider';
import { useUser } from '../../providers/user-provider';
import { useCommonStyles } from '../common-styles';
import { ErrorMessage } from '../error-message';

interface Water {
    size: number;
    target: number;
    count: number;
}

const validationTests: ValidationTest<Water>[] =
    [
        {
            passCondition: ({ size }) => size > 0,
            result: {
                message: 'Water size must be greater than 0.',
                name: 'size',
            }
        },
        {
            passCondition: ({ target }) => target > 0,
            result: {
                message: 'Water target must be greater than 0.',
                name: 'target',
            }
        }
    ]

export const Water: React.FC = () => {
    const commonClasses = useCommonStyles();
    const { user, updateUser } = useUser();
    const alert = useAlertMessage();
    const { Api } = useApi();

    const [water, setWater] = useState<Water>({
        size: 0,
        target: 0,
        count: 0,
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [postingUser, setPostingUser] = useState(false);

    useEffect(() => {
        setWater({
            size: user.waterSize,
            target: user.waterTarget,
            count: Math.floor(user.waterTarget / user.waterSize),
        });
    }, [user])

    const updateWater = async () => {
        const [valid] = validateAll(validationTests, water);
        setIsSubmitted(true);

        if (!postingUser && valid) {
            setPostingUser(true);
            Api.User.updateUser({
                ...user,
                waterSize: water.size,
                waterTarget: water.target,
            })
            .then(() => {
                updateUser();
            })
            .catch(error => {
                alert.addMessage(error.message)
            })
            .finally(() => {
                setPostingUser(false);
                setIsSubmitted(false);
            });
        }
    }

    const hasChanged = user.waterSize !== water.size || user.waterTarget !== water.target;

    const [isValid, results] = validateAll(validationTests, water);
    const showErrors = isSubmitted && !isValid;

    const hasErrors = (name: string) => results.map(r => r.name).includes(name);

    const onChangeSize: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;
        const size = Number(value);

        setWater(_water => {
            const target = size * _water.count;
            return ({
                ..._water,
                target,
                size,
            });
        });
    }

    const onChangeCount: React.ChangeEventHandler<HTMLInputElement> = event => {
        const { value } = event.target;
        const count = Number(value);

        setWater(_water => {
            const target = _water.size * count;
            return ({
                ..._water,
                target,
                count,
            });
        });
    }

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} md={10} xl={8}>
                <Paper className={commonClasses.paper}>
                    <Box mb={2}>
                        <Typography variant="h4">Water</Typography>
                        <p>Change how much drinking water you would like to track for a each day.</p>
                    </Box>

                    <form noValidate autoComplete="off">
                        <FormControl className={commonClasses.formControl}>
                            <TextField
                                name="size"
                                variant="standard"
                                type="number"
                                label="Size of each cup"
                                error={showErrors && hasErrors("size")}
                                value={water.size || ''}
                                onChange={onChangeSize}
                            />
                            <ErrorMessage isSubmitted={isSubmitted} inputName="size" results={results} />
                        </FormControl>
                        <FormControl className={commonClasses.formControl}>
                            <TextField
                                name="count"
                                variant="standard"
                                type="number"
                                label="Total number of cups"
                                error={showErrors && hasErrors("count")}
                                value={water.count || ''}
                                onChange={onChangeCount}
                            />
                            <ErrorMessage isSubmitted={isSubmitted} inputName="count" results={results} />
                        </FormControl>

                        <FormControl className={commonClasses.formControl}>
                            <InputLabel htmlFor="target">Total Amount</InputLabel>
                            <Input id="target" readOnly value={water.target} />
                        </FormControl>
                    </form>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Box display="flex" alignItems="center">
                            <Box mr={1}>
                                <Button color="primary" onClick={updateWater} disabled={postingUser || !hasChanged}>Update</Button>
                                {postingUser && <CircularProgress size={24} className={commonClasses.buttonProgress}></CircularProgress>}
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}