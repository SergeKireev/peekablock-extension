import { Button } from "@mui/material";
import { styled } from "@mui/system";
import React, { HTMLProps } from "react";

interface StyledButtonProps {
    variant: 'text' | 'outlined' | 'contained'
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    onClick: () => void
}

type Props = HTMLProps<void> & StyledButtonProps

export const StyledButton = styled((props: Props) => (
    <Button
        className={props.className}
        variant={props.variant}
        color={props.color}
        onClick={props.onClick}
    >
        {props.children}
    </Button>
))(({ theme }) => ({
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'none'
}));