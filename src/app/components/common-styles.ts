import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";


export const useCommonStyles = makeStyles((theme: Theme) => createStyles({
    paper: {
        padding: theme.spacing(2, 4),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1, 2)
        },
        marginBottom: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            marginBottom: theme.spacing(1)
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
    buttonProgress: {
        position: 'absolute',
        left: '-100%',
        marginTop: -12,
        marginLeft: -12,
    },
    card: {
        margin: theme.spacing(1, 0, 0),
        position: 'relative',
    }
}));