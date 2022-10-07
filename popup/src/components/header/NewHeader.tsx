import { Button, ClickAwayListener, Menu, MenuItem } from '@mui/material';
import React from 'react'
import { MenuOption } from '../common/menu/Menu'
import { ScaledMenuItem } from '../common/menu/ScaledMenuItem';

interface HeaderProps {
    menuOptions?: MenuOption[]
}

export const NewHeader = (props: HeaderProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (<div className='new_header'>
        <div className='new_logo_container'>
            <img className='new_peekablock_logo' src='./assets/peekablock_logo.svg' />
            <img className='new_peekablock_title' src='./assets/peekablock.svg' />
            {/* <div className='new_header_running_container slow_blinking'>
                <div className='new_header_running_indicator'>{messages.RUNNING}</div>
                <img src="./assets/play.svg" style={{width: 15}} />
            </div> */}
        </div>
        {
            props.menuOptions ?
                <ClickAwayListener onClickAway={handleClose}>
                    <div>
                        <Button
                            onClick={handleClick}
                            variant="text"
                            className='new_header_menu'
                        >
                            <img className='new_header_menu' src="./assets/menu_bars.svg" />
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            {
                                props.menuOptions.map(el => {
                                    return <ScaledMenuItem onClick={() => {
                                        handleClose()
                                        el.callback()
                                    }}>
                                        {
                                            el.label
                                        }
                                    </ScaledMenuItem>
                                })
                            }
                        </Menu>
                    </div>
                </ClickAwayListener>
                : undefined
        }
    </div>)
}