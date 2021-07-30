import React from 'react';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import FreeBreakfastOutlinedIcon from '@material-ui/icons/FreeBreakfastOutlined';
import AcUnitOutlinedIcon from '@material-ui/icons/AcUnitOutlined';
import OutlinedFlagOutlinedIcon from '@material-ui/icons/OutlinedFlagOutlined';

import PickleIcon from './svg/pickle';

export const iconLibrary: {[key: string ]: JSX.Element} = {
    ['coffeeCup']: <FreeBreakfastOutlinedIcon />,
    ['checkmark']: <CheckOutlinedIcon />,
    ['snowflake']: <AcUnitOutlinedIcon />,
    ['flag']: <OutlinedFlagOutlinedIcon />,
    ['pickle']: <PickleIcon />,
}

export const iconNames = Object.keys(iconLibrary);