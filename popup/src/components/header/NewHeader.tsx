import React from 'react'

export const NewHeader = () => {
    return (<div className='new_header'>
        <div className='new_logo_container'>
            <div className='new_peekablock_logo'>PaB</div>
            <div className='new_header_running_indicator'>Running</div>
            <i className="new_header_icon_play fa fa-play-circle" />
        </div>
        <i className='fa fa-bars new_header_menu' />
    </div>)
}