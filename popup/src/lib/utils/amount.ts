import { BigNumber, BigNumberish } from "ethers";
import leftPad = require('left-pad')
import { Amount } from "../domain/event";

const PRECISION = 5
const MIN_SIGNIFICANT_DIGITS = 2
const UINT256MAX = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
const MAX_LABEL = 'ALL'

export function isMaxNumish(x: string): boolean {
    return x === UINT256MAX ||
        x === '-1' ||
        x === '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
}

function mostSignificantDigitPosition(mantissa: string): number {
    return (trimLeadingZeroes(mantissa).length - 1)
}

function trimLeadingZeroes(s: string) {
    let i = 0;
    while (s[i] === '0') {
        i++
    }
    return s.substring(i);
}

export function displayInteger(s: string) {
    if (s.length > 3) {
        const res = displayInteger(s.substring(0, s.length-3))
        const remainder = s.substring(s.length-3)
        return `${res},${remainder}`
    } else {
        return s
    }
}

export function displayAmount(amount: Amount) {
    if (isMaxNumish(amount.mantissa)) {
        return 'All'
    }
    const pow_of_10 = mostSignificantDigitPosition(amount.mantissa)
    const diff = pow_of_10 - amount.exponent
    if (diff <= -(PRECISION - 1)) {
        //Case when we want to display 2 sig digits
        return `0.${leftPad(amount.mantissa.substring(0, MIN_SIGNIFICANT_DIGITS), (-diff) + (MIN_SIGNIFICANT_DIGITS - 1), '0')}`
    } else if (diff < 0) {
        //Case when we display 5 digits and number < 1
        return `0.${leftPad(amount.mantissa.substring(0, (PRECISION + diff)), PRECISION - 1, '0')}`
    } else if (diff < (PRECISION - MIN_SIGNIFICANT_DIGITS - 1)) {
        //Case when we display 5 digits and number > 1
        const separatorPosition = diff + 1
        return `${amount.mantissa.substring(0, separatorPosition)}.${amount.mantissa.substring(separatorPosition, PRECISION)}`
    } else {
        //Case when we display >5 digits
        const separatorPosition = diff + 1
        const withCommas = displayInteger(amount.mantissa.substring(0, separatorPosition))
        return `${withCommas}.${amount.mantissa.substring(separatorPosition, separatorPosition + MIN_SIGNIFICANT_DIGITS)}`
    }
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
    const integerPart = displayInteger(fixedDisplay.substring(0, fixedDisplayLength - precision))
    return `${integerPart}.${fixedDisplay.substring(fixedDisplayLength - precision)}`
}

function bigNumberOr(n: BigNumberish, _default: BigNumberish) {
    try {
        return BigNumber.from(n)
    } catch (e) {
        return BigNumber.from(_default)
    }
}