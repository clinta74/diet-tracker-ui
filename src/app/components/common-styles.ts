import type { CSSProperties } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Shared `sx` styles. Combine with component-specific ones using an array:
 * `sx={[commonSx.paper, { mb: 1 }]}`.
 */
export const commonSx = {
    paper: {
        px: 4,
        py: 2,
        mb: { xs: 1, sm: 2 },
        backgroundImage: 'none',
    },
    divider: {
        my: 2,
    },
    buttonProgress: {
        position: 'absolute',
        left: '-100%',
        mt: '-12px',
        ml: '-12px',
    },
    card: {
        mt: 1,
        position: 'relative',
    },
} satisfies Record<string, SxProps<Theme>>;

/** For react-router links, which don't take `sx`. */
export const plainLinkStyle: CSSProperties = {
    textDecoration: 'none',
};
