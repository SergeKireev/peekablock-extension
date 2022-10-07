import React from "react";
import { MenuItem, MenuItemProps } from "@mui/material";
import { SCALING_FACTOR } from "../body/global";

export const ScaledMenuItem = (props: MenuItemProps) => {
    return <MenuItem
        {...props}
        sx={{
            fontSize: 16*SCALING_FACTOR
        }}
    >
        {props.children}
    </MenuItem>
}