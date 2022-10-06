import { Button, useThemeProps } from "@mui/material";
import { styled } from "@mui/system";
import React, { HTMLProps } from "react";
import { Property } from 'csstype'

interface StyledButtonProps {
    variant: 'text' | 'outlined' | 'contained'
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    fontStyle?: Property.FontStyle
    fontWeight?: Property.FontWeight
    fontSize?: number
    textTransform?: Property.TextTransform
    disableRipple?: boolean
    padding?: number,
    paddingHorizontal?: number
    paddingVertical?: number
    minWidth?: number
    onClick: () => void
}

type Props = HTMLProps<void> & StyledButtonProps

export const StyledButton = styled((props: Props) => (
    <Button
        className={props.className}
        variant={props.variant}
        color={props.color}
        onClick={props.onClick}
        disableRipple={props.disableRipple}
    >
        {props.children}
    </Button>
))(({ theme,
    fontSize,
    fontStyle,
    fontWeight,
    textTransform,
    padding,
    paddingHorizontal,
    paddingVertical,
    minWidth }) => {
    const _minWidth = minWidth !== undefined ? { minWidth: minWidth } : {}
    const _padding = padding !== undefined ? { padding: padding } : {}
    const _paddingVertical = paddingVertical !== undefined ? { paddingVertical: paddingVertical } : {}
    const _paddingHorizontal = paddingHorizontal !== undefined ? { paddingHorizontal: paddingHorizontal } : {}
    return {
        fontFamily: 'Roboto',
        fontStyle: fontStyle || 'normal',
        fontWeight: fontWeight || '700',
        fontSize: fontSize || 16,
        textTransform: textTransform || 'none',
        ..._padding,
        ..._paddingVertical,
        ..._paddingHorizontal,
        ..._minWidth,
    }
});