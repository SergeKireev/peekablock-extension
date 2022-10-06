import React from "react";
import { HTMLProps } from "react";
import { StyledButton } from "./StyledButton";
import { Property } from 'csstype'

interface StyledLinkButtonProps {
    link: string
    fontSize?: number
    fontWeight?: Property.FontWeight
    enableHover?: boolean 
    enableRipple?: boolean
    paddingHorizontal?: number
    paddingVertical?: number 
}

type Props = StyledLinkButtonProps & HTMLProps<void>

export const StyledLinkButton = (props: Props) => {
    const additionalClassName = props.enableHover ? '' : 'new_link_button' 
    const linkClassName = `${props.className} ${additionalClassName}`
    return <StyledButton
        variant="text"
        color="secondary"
        fontSize={16}
        fontWeight={props.fontWeight || 'normal'}
        disableRipple={!props.enableRipple}
        className={linkClassName}
        padding={0}
        paddingHorizontal={props.paddingHorizontal || 0}
        paddingVertical={props.paddingVertical || 0}
        minWidth={0}
        onClick={() => {
            window.open(props.link, '_blank');
        }}
    >
        {props.children}
    </StyledButton>
}