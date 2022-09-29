import { Address, Event } from "../domain/event";
import { USER_LABEL } from "../domain/user";

const chainId = '1'

const assetEquivalence: { [chainId: string]: { [address: string]: string[] } } = {
    [chainId]: {
        "0x0": ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"]
    }
}

/**
 * Reorder the transfer events
 */

function isAssetEquivalent(asset: string, other: string) {
    const equivA = assetEquivalence[chainId][asset];
    const equivB = assetEquivalence[chainId][other];
    const result = (equivA && equivA.indexOf(other) !== -1) ||
        (equivB && equivB.indexOf(asset) !== -1)
    return result
}

function findFromPreviousTarget(previousEvent: Event, events: Event[]): number {
    if (!previousEvent) return -1;

    //Prioritise same asset as previous event first
    let result = events.findIndex(e => {
        return (
            isAssetEquivalent(
                e.token.address.toLowerCase(),
                previousEvent.token.address.toLowerCase()) &&
            (previousEvent.to.address.toLowerCase() ===
                e.from.address.toLowerCase())
        )
    });

    //Else departing from target but any asset
    if (result === -1) {
        result = events.findIndex(e => {
            return previousEvent.to.address.toLowerCase() ===
                e.from.address.toLowerCase()
        })
    }

    return result;
}

function isEquivToBase(base: string, address: Address) {
    return base === address.address.toLowerCase() || base === address.label
}

function findFromBase(bases: string[], events: Event[]): number {
    const result = events.findIndex(e => {
        return bases.findIndex(b => isEquivToBase(b, e.from)) !== -1
    })
    return result
}

function findNextEventIndex(previousEvent: Event, events: Event[], bases: string[]) {
    let nextIndex = findFromPreviousTarget(previousEvent, events)

    //If we finished a branch restart from a previously seen base
    if (nextIndex === -1)
        nextIndex = findFromBase(bases, events);
    return Math.max(nextIndex, 0);
}

export function reorder(events: Event[]): Event[] {
    let _events = events.slice();
    let result = [];
    const bases = [USER_LABEL];

    let previousEvent = undefined;
    while (_events.length) {
        let nextIndex = findNextEventIndex(previousEvent, _events, bases);
        previousEvent = _events[nextIndex];
        _events.splice(nextIndex, 1);
        bases.push(previousEvent.from.address.toLowerCase())
        result.push(previousEvent)
    }
    return result;
}