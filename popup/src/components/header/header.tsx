import { Address } from "../../lib/domain/event"
import * as React from 'react';
import { AddressDisplay } from "../common/AddressDisplay";

export interface HeaderProps {
    me: Address,
    target: Address
}

export const Header = ({ me, target }: HeaderProps) => {
    return <div className="header" id="header">
        <AddressDisplay address={me} />
        <i className="fa fa-arrow-right header_arrow" />
        <AddressDisplay address={target} />
    </div>;
}