import { BigNumber, BigNumberish } from "ethers";
import leftPad = require('left-pad')
import { Amount } from "../domain/event";

const PRECISION = 5
const UINT256MAX = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

const MAX_LABEL = 'ALL'

export function isMaxNumish(x: string): boolean {
    return x === UINT256MAX ||
        x === '-1' ||
        x === '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
}

export function displayNumber(number: BigNumber, decimals: number, precision: number = PRECISION) {
    if (decimals === 1) {
        return number.toString();
    }

    const rounded = number.div(BigNumber.from(10).pow(decimals - precision)).toString()
    let amount = leftPad(rounded, precision + 1, '0')

    const amountLength = amount.length
    amount = `${amount.substring(0, amountLength - precision)}.${amount.substring(amountLength - precision)}`
    return amount;
}

export function displayAmount(amount: Amount) {
    if (isMaxNumish(amount.mantissa))
        return MAX_LABEL
    return displayNumber(BigNumber.from(amount.mantissa), amount.exponent, PRECISION);
}

export function displayUsdAmount(amount: Amount, usdPrice: number) {
    const number = bigNumberOr(amount.mantissa, '0');
    const decimals = amount.exponent;
    const USD_PRECISION = 2;
    const precision = USD_PRECISION;
    const fixedUsdPrice = bigNumberOr(Math.round(usdPrice * (10 ** USD_PRECISION)), 0)
    const totalUsdPrice = number
        .mul(fixedUsdPrice)
        .div(BigNumber.from(10).pow(decimals));
    let fixedDisplay = totalUsdPrice.toString()
    fixedDisplay = leftPad(fixedDisplay, precision + 1, '0')
    const fixedDisplayLength = fixedDisplay.length
    return `${fixedDisplay.substring(0, fixedDisplayLength - precision)}.${fixedDisplay.substring(fixedDisplayLength - precision)}`
}

function bigNumberOr(n: BigNumberish, _default: BigNumberish) {
    try {
        return BigNumber.from(n)
    } catch(e) {
        return BigNumber.from(_default)
    }
}