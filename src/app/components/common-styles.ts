import { createStyles, makeStyles, Theme } from "@material-ui/core";


export const useCommonStyles = makeStyles((theme: Theme) => createStyles({
        paper: {
            padding: theme.spacing(2, 4),
            [theme.breakpoints.down('sm')]: {
                padding: theme.spacing(1, 2)
            },
            backgroundImage: 'none',
        },
        breadcrumb: {
            margin: theme.spacing(2, 0),
        },
        divider: {
            margin: theme.spacing(2, 0),
        },
        link: {
            textDecoration: 'none',
        },
    })
);