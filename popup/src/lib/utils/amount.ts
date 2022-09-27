import { BigNumber } from "ethers";
import leftPad = require('left-pad')

const PRECISION = 5
const UINT256MAX = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

export function displayAmount(number: BigNumber, decimals: number, precision: number = PRECISION) {
        if (number.toString() == UINT256MAX) {
            return '-1';
        }
        const rounded = number.div(BigNumber.from(10).pow(decimals - precision)).toString()
        let amount = leftPad(rounded, precision + 1, '0')
        const amountLength = amount.length
        amount = `${amount.substring(0, amountLength - precision)},${amount.substring(amountLength - precision)}`
        return amount;
}