import { Tab } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";

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
    fontSize: 16,
    marginRight: theme.spacing(1),
}));