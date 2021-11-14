import React from 'react';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import FreeBreakfastOutlinedIcon from '@mui/icons-material/FreeBreakfastOutlined';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import OutlinedFlagOutlinedIcon from '@mui/icons-material/OutlinedFlagOutlined';
import ChangeHistoryOutlinedIcon from '@mui/icons-material/ChangeHistoryOutlined';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import CropSquareOutlinedIcon from '@mui/icons-material/CropSquareOutlined';

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