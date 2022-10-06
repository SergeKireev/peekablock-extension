import { expect } from "chai"
import { Amount } from "../lib/domain/event"
import { displayAmount } from "../lib/utils/amount"

describe('Display amounts', () => {
    it('Very small', () => {
        const amount: Amount = {
            mantissa: '1110000000',
            exponent: 18
        }
        const display = displayAmount(amount)
        expect(display).to.be.equals('0.0000000011');
    })

    it('Display 5 digits < 1', () => {
        const amount: Amount = {
            mantissa: '123000000000000000',
            exponent: 18
        }
        const display = displayAmount(amount)
        expect(display).to.be.equals('0.1230');
    })

    it('Display 5 digits should have at least 2', () => {
        const amount: Amount = {
            mantissa: '123000000000000',
            exponent: 18
        }
        const display = displayAmount(amount)
        expect(display).to.be.equals('0.00012');
    })


    it('Display 5 digits < 1 other', () => {
        const amount: Amount = {
            mantissa: '1230000000000000',
            exponent: 18
        }
        const display = displayAmount(amount)
        expect(display).to.be.equals('0.0012');
    })

    it('Display 5 digits > 1', () => {
        const amount: Amount = {
            mantissa: '12300000000000000000',
            exponent: 18
        }
        const display = displayAmount(amount)
        expect(display).to.be.equals('12.300');
    })

    it('Display 5 digits > 1 other', () => {
        const amount: Amount = {
            mantissa: '123400000000000000000',
            exponent: 18
        }
        const display = displayAmount(amount)
        expect(display).to.be.equals('123.40');
    })

    it('Many display digits', () => {
        const amount: Amount = {
            mantissa: '12345500000000000000000',
            exponent: 18
        }
        const display = displayAmount(amount)
        expect(display).to.be.equals('12345.50');
    })
})