import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/system";
import React, { HTMLProps } from "react";
import { SCALING_FACTOR } from "../body/global";

interface StyledButtonProps {
    loading: boolean
    variant: 'text' | 'outlined' | 'contained'
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    onClick: () => void
}

type Props = HTMLProps<void> & StyledButtonProps

export const StyledLoadingButton = styled((props: Props) => (
    <LoadingButton
        className={props.className}
        loading={props.loading}
        variant={props.variant}
        color={props.color}
        onClick={props.onClick}
    >
        {props.children}
    </LoadingButton>
))(({ theme }) => ({
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: Math.round(16 * SCALING_FACTOR),
    textTransform: 'none'
}));