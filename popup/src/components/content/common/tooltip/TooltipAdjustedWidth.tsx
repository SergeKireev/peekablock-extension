import React from "react"

interface Dimensions {
    width: number
    x: number
}

interface Props {
    dimensions: Dimensions
    factor: number
}

/**
 * the scale factor in the css messes with the tooltip positioning. We create a virtual anchorEl
 * With the right position
 */

export const TooltipAdjustedWidth = (props: Props) => {
    const adjustedMarginLeft = props.dimensions.x * (1 - props.factor)
    const adjustedWidth = props.dimensions.width * props.factor
    return <div className='tooltip_width_adjusted'
        // style={{
        //     marginLeft: -adjustedMarginLeft,
        //     width: adjustedWidth
        // }}
    >.</div>
}