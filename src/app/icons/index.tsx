import React from 'react';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import FreeBreakfastOutlinedIcon from '@material-ui/icons/FreeBreakfastOutlined';
import AcUnitOutlinedIcon from '@material-ui/icons/AcUnitOutlined';
import OutlinedFlagOutlinedIcon from '@material-ui/icons/OutlinedFlagOutlined';
import ChangeHistoryOutlinedIcon from '@material-ui/icons/ChangeHistoryOutlined';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import CropSquareOutlinedIcon from '@material-ui/icons/CropSquareOutlined';

import PickleIcon from './svg/pickle';

export const iconLibrary: {[key: string ]: JSX.Element} = {
    ['checkmark']: <CheckOutlinedIcon fontSize="inherit"/>,
    ['circle']: <FiberManualRecordOutlinedIcon fontSize="inherit"/>,
    ['coffeeCup']: <FreeBreakfastOutlinedIcon fontSize="inherit"/>,
    ['flag']: <OutlinedFlagOutlinedIcon fontSize="inherit"/>,
    ['snowflake']: <AcUnitOutlinedIcon fontSize="inherit"/>,
    ['square']: <CropSquareOutlinedIcon fontSize="inherit"/>,
    ['triangle']: <ChangeHistoryOutlinedIcon fontSize="inherit"/>,
    ['pickle']: <PickleIcon fontSize="inherit"/>,
}

export const iconLibraryNames = Object.keys(iconLibrary);