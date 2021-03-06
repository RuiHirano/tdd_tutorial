import { factory } from "typescript";


export class Money {
    amount: number
    currency: CurrencyState
    constructor(amount: number, currency: CurrencyState) {
        if (amount < 0) throw new Error("result is minus value");
        this.amount = amount
        this.currency = currency
    }
}


export class Doller extends Money {
    constructor(amount: number) {
        const currency: CurrencyState = "USD"
        super(amount, currency)
    }
}

export class Franc extends Money {
    constructor(amount: number) {
        const currency: CurrencyState = "CHF"
        super(amount, currency)
    }
}

export type CurrencyState = "CHF" | "USD"

export class MoneyFactory {
    constructor() {
    }
    create(amount: number, state: CurrencyState) {
        switch (state) {
            case "USD":
                return new Doller(amount)
            case "CHF":
                return new Franc(amount)
            default:
                throw new Error("unknown currency");
        }
    }
}

export class Calculator {
    factory: MoneyFactory
    bank: Bank
    constructor(bank: Bank) {
        this.factory = new MoneyFactory()
        this.bank = bank
    }
    plus(money1: Money, money2: Money, currency: CurrencyState) {
        const amount = this.bank.exchange(money1, currency).amount + this.bank.exchange(money2, currency).amount
        return this.factory.create(amount, currency)
    }
    reduce(money1: Money, money2: Money, currency: CurrencyState) {
        const amount = this.bank.exchange(money1, currency).amount - this.bank.exchange(money2, currency).amount
        return this.factory.create(amount, currency)
    }
    times(money: Money, multiplier: number) {
        const newAmount = money.amount * multiplier
        return this.factory.create(newAmount, money.currency)
    }
    equals(money1: Money, money2: Money) {
        return money1.amount === money2.amount && money1.currency === money2.currency
    }
}

export class Bank {
    rateMap: Map<CurrencyState, Map<CurrencyState, number>>
    factory: MoneyFactory
    constructor() {
        this.rateMap = new Map()
        this.factory = new MoneyFactory()
    }
    addRate(from: CurrencyState, to: CurrencyState, rate: number) {
        if (rate < 0) {
            throw new Error("rate is minus");
        }
        this.rateMap.set(from, new Map().set(to, rate))
    }
    getRate(from: CurrencyState, to: CurrencyState) {
        if (from === to) return 1

        const rate = this.rateMap.get(from)?.get(to)
        if (rate === undefined) {
            throw new Error("unknown rate");
        }
        return rate
    }
    exchange(money: Money, to: CurrencyState) {
        const rate = this.getRate(money.currency, to)
        return this.factory.create(money.amount * rate, to)
    }
}

const main = () => {
    const factory = new MoneyFactory()
    const doller5 = factory.create(7, "USD")
    const franc10 = factory.create(10, "CHF")

    const bank = new Bank()
    bank.addRate("USD", "CHF", 2)
    bank.addRate("CHF", "USD", 0.5)
    const calclator = new Calculator(bank)
    const isEquals = calclator.equals(doller5, franc10)
    const isEquals2 = calclator.equals(doller5, doller5)
    const plusedMoney = calclator.plus(doller5, franc10, "CHF")
    const reducedMoney = calclator.reduce(doller5, franc10, "USD")

    console.log(`isEquals ${isEquals} ${isEquals2}, plusedMoney: ${plusedMoney.amount} ${plusedMoney.currency}, reducedMoney: ${reducedMoney.amount} ${reducedMoney.currency}`)


}

main()