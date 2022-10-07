import { Tab } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";
import { SCALING_FACTOR } from "../body/global";

interface StyledTabProps {
    label: string
    value: string
}

export const StyledTab = styled((props: StyledTabProps) => (
    <Tab 
    disableRipple
    {...props}
    />
))(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 'normal',
    fontSize: Math.round(16 * SCALING_FACTOR),
    marginRight: theme.spacing(1),
}));