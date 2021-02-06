'use strict';

class Money {
    amount: number
    currency: CurrencyType
    constructor(amount: number, currency: CurrencyType) {
        this.amount = amount
        this.currency = currency
    }
}

class Doller extends Money {
    constructor(amount: number) {
        const currency: CurrencyType = "USD"
        super(amount, currency)
    }

}

class Franc extends Money {
    constructor(amount: number) {
        const currency: CurrencyType = "CHF"
        super(amount, currency)
    }
}

class Calculator {
    bank: Bank
    constructor(bank: Bank) {
        this.bank = bank
    }

    // かけ算
    times(money: Money, multiplier: number) {
        return new Money(money.amount * multiplier, money.currency)
    }

    // return added money by money2 currency type   money1 + money2
    plus(money1: Money, money2: Money, currency: CurrencyType) {
        const amount = this.bank.exchange(money1, currency).amount + this.bank.exchange(money2, currency).amount
        return new Money(amount, money2.currency)
    }

    // money1 - money2
    reduce(money1: Money, money2: Money, currency: CurrencyType) {
        const amount = this.bank.exchange(money1, currency).amount - this.bank.exchange(money2, currency).amount
        if (amount < 0) { throw new Error("culculated amount is minus") }
        return new Money(amount, currency)
    }

    equals(money1: Money, money2: Money) {
        return money1.amount === money2.amount && money1.currency === money2.currency
    }
}

// 為替比率のデータ
interface Pair {
    from: CurrencyType
    to: CurrencyType
    rate: number
}

class RateData {
    //pairMap: { [s: string]: { [s: string]: Pair } }
    pairMap: Map<CurrencyType, Map<CurrencyType, Pair>>

    constructor() {
        this.pairMap = new Map()
    }
    addRate(pair: Pair) {
        this.pairMap.set(pair.from, new Map().set(pair.to, pair))
        //this.pairMap[pair.from][pair.to] = pair
    }

    getRate(money: Money, tgtCurrancy: CurrencyType) {
        if (money.currency === tgtCurrancy) return 1
        const pair = this.pairMap.get(money.currency)?.get(tgtCurrancy)
        if (pair === undefined) {
            throw new Error("unknown rate");
        }
        return pair.rate
    }
}

class Bank {
    rateData: RateData
    factory: CurrencyFactory
    // 為替に従い変換するクラス
    constructor(rateData: RateData) {
        this.rateData = rateData
        this.factory = new CurrencyFactory()
    }

    exchange(money: Money, tgtCurrancy: CurrencyType) {
        const rate = this.rateData.getRate(money, tgtCurrancy)
        const newAmount = money.amount * rate
        const newMoney = this.factory.create(newAmount, tgtCurrancy)
        return newMoney
    }
}

type CurrencyType = "USD" | "CHF"

class CurrencyFactory {
    // 通貨生成クラス
    constructor() {
    }

    create(amount: number, type: CurrencyType) {
        switch (type) {
            case "USD":
                return new Doller(amount)
            case "CHF":
                return new Franc(amount)
            default:
                throw new Error("ERROR: currency type is not exist.");
        }
    }
}


const main = () => {
    const factory = new CurrencyFactory()
    const doller5 = factory.create(7, "USD")
    const franc10 = factory.create(10, "CHF")

    const rateData = new RateData()
    rateData.addRate({ from: "USD", to: "CHF", rate: 2 })
    rateData.addRate({ from: "CHF", to: "USD", rate: 0.5 })
    const bank = new Bank(rateData)
    const calclator = new Calculator(bank)
    const isEquals = calclator.equals(doller5, franc10)
    const isEquals2 = calclator.equals(doller5, doller5)
    const plusedMoney = calclator.plus(doller5, franc10, "CHF")
    const reducedMoney = calclator.reduce(doller5, franc10, "USD")

    console.log(`isEquals ${isEquals} ${isEquals2}, plusedMoney: ${plusedMoney.amount} ${plusedMoney.currency}, reducedMoney: ${reducedMoney.amount} ${reducedMoney.currency}`)


}

main()
// output