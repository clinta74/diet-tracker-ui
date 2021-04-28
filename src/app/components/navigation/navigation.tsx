import React from 'react';
import { ElevateAppBar } from './elevation-app-bar';
import { SideNav } from './side-nav';

export const Navigation: React.FC = () => {
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen: React.MouseEventHandler = event => {
        event.stopPropagation();
        setOpen(true);
    };

    const handleDrawerClose: React.MouseEventHandler = () => {
        setOpen(false);
    };

    const handleClickAway: React.MouseEventHandler<Document> = () => {
        setOpen(false);
    }

    return (
        <React.Fragment>
            <ElevateAppBar open={open} handleDrawerOpen={handleDrawerOpen} />
            <SideNav open={open} handleDrawerClose={handleDrawerClose} handleClickAway={handleClickAway} />
        </React.Fragment >
    );
}