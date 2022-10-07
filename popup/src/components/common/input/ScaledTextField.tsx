import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { SCALING_FACTOR } from "../body/global";

export const ScaledTextField = (props: TextFieldProps) => {
    return <TextField
        {...props}
        sx={{
            fontSize: 16 * SCALING_FACTOR
        }}
    />
}