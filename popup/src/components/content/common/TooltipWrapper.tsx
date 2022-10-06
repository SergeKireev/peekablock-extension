import { ClickAwayListener, styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import React, { HTMLProps, ReactElement, useLayoutEffect, useRef, useState } from "react";
import { SCALING_FACTOR } from "../../common/body/global";
import { TooltipAdjustedWidth } from "./tooltip/TooltipAdjustedWidth";

type Placement = 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';

export interface WithTooltipProps {
    tooltip: ReactElement
    placement: Placement
}
type Props = HTMLProps<void> & WithTooltipProps

type HtmlTooltipProps = TooltipProps & { dimensions: any }

const HtmlTooltip = styled(({ className, ...props }: HtmlTooltipProps) => {
    //Use this key to reload the component when dimensions of anchor element have changed
    const key = `${props.dimensions.width}_${props.dimensions.x}`
    return <Tooltip {...props}
        key={key}
        classes={{ popper: className }} />
}
)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#00000000',
    },
}));

export const WithTooltip = (props: Props) => {
    const [open, setOpen] = useState(false);

    const anchorElRef: any = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, x: 0 });

    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleTooltipToggle = () => {
        setOpen(!open);
    };

    useLayoutEffect(() => {
        const newWidth = anchorElRef.current.offsetWidth
        const newX = anchorElRef.current.offsetLeft
        if (anchorElRef.current &&
            (newWidth !== dimensions.width || newX !== dimensions.x)) {
            setDimensions({
                width: anchorElRef.current.offsetWidth,
                x: anchorElRef.current.offsetLeft
            });
        }
    })

    const className = !open ? 'tooltippable' : 'tooltippable-selected'

    return <ClickAwayListener
        onClickAway={handleTooltipClose}
    >
        <div className={className}>
            <div onClick={handleTooltipToggle} className={props.className} ref={anchorElRef}>
                {props.children}
            </div>
            <HtmlTooltip
                disableHoverListener
                disableFocusListener
                disableTouchListener
                open={open}
                onClose={handleTooltipClose}
                placement={props.placement}
                dimensions={dimensions}
                title={
                    props.tooltip
                }
            >
                <div className='tooltip_width_adjusted' />
            </HtmlTooltip>
        </div>
    </ClickAwayListener>
}
