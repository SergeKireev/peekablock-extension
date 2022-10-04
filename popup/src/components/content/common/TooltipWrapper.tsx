import { ClickAwayListener, styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import React, { HTMLProps, ReactElement, useState } from "react";

type Placement = 'bottom-start' | 'bottom-end'

export interface WithTooltipProps {
    tooltip: ReactElement
    placement: Placement
}
type Props = HTMLProps<void> & WithTooltipProps

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#00000000',
    },
}));

export const WithTooltip = (props: Props) => {
    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipToggle = () => {
        setOpen(!open);
    };

    const className = !open ? 'tooltippable' : 'tooltippable-selected'

    return <ClickAwayListener
        onClickAway={handleTooltipClose}
    >
        <div className={className}>
            <HtmlTooltip
                disableHoverListener
                disableFocusListener
                disableTouchListener
                open={open}
                onClose={handleTooltipClose}
                placement={props.placement}
                title={
                    props.tooltip
                }
            >
                <div onClick={handleTooltipToggle} className={props.className}>
                    {props.children}
                </div>
            </HtmlTooltip>
        </div>
    </ClickAwayListener>
}
