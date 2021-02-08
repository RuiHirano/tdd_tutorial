
import { Doller, Franc, MoneyFactory, Money, Calculator, Bank } from "#/index";

describe('doller class', (): void => {
    test('doller(5) amount equals 5', (): void => {
        const doller = new Doller(5)
        expect(doller.amount).toBe(5);
    });

})

describe('franc class', (): void => {
    test('franc(5) amount equals 5', (): void => {
        const franc = new Franc(5)
        expect(franc.amount).toBe(5);
    });
})

describe('money class', (): void => {
    test('FrancがMoneyを継承している', (): void => {
        const franc = new Franc(5)
        expect(franc instanceof Money).toBe(true);
    });

    test('DollerがMoneyを継承している', (): void => {
        const doller = new Doller(5)
        expect(doller instanceof Money).toBe(true);
    });

    test('Moneyがamountを保持している', (): void => {
        const factory = new MoneyFactory()
        const doller = factory.create(5, "USD")
        expect(doller.amount).toBe(5);
    });
    test('Moneyがcurrencyを保持している', (): void => {
        const factory = new MoneyFactory()
        const doller = factory.create(5, "USD")
        expect(doller.currency).toBe("USD");
    });
    test('amountが負の場合にエラー', (): void => {
        const factory = new MoneyFactory()
        expect(() => factory.create(-5, "USD")).toThrowError("result is minus value");
    });
})

describe('factory class', (): void => {
    test('factory("CHF") create Franc Class', (): void => {
        const factory = new MoneyFactory()
        const franc = factory.create(5, "CHF")
        expect(franc instanceof Franc).toBe(true);
    });

    test('factory("USD") create Doller Class', (): void => {
        const factory = new MoneyFactory()
        const doller = factory.create(5, "USD")
        expect(doller instanceof Doller).toBe(true);
    });

    test('factory("USD") not equal Franc Class', (): void => {
        const factory = new MoneyFactory()
        const doller = factory.create(5, "USD")
        expect(doller instanceof Franc).toBe(false);
    });
})

describe('calculator class', (): void => {
    test('plus(): 5$ + 5$ = 10$', (): void => {
        const factory = new MoneyFactory()
        const doller5 = factory.create(5, "USD")
        const bank = new Bank()
        const calculator = new Calculator(bank)
        const plusedDoller = calculator.plus(doller5, doller5, "USD")
        expect(plusedDoller.amount).toBe(10);
    });

    test('reduce(): 10$ - 5$ = 5$', (): void => {
        const factory = new MoneyFactory()
        const doller10 = factory.create(10, "USD")
        const doller5 = factory.create(5, "USD")
        const bank = new Bank()
        const calculator = new Calculator(bank)
        const reducedDoller = calculator.reduce(doller10, doller5, "USD")
        expect(reducedDoller.amount).toBe(5);
    });

    test('reduce(): 10$ - 15$ = -5$ throw error, 結果が負になった場合のエラー処理', (): void => {
        const factory = new MoneyFactory()
        const doller10 = factory.create(10, "USD")
        const doller15 = factory.create(15, "USD")
        const bank = new Bank()
        const calculator = new Calculator(bank)
        expect(() => calculator.reduce(doller10, doller15, "USD")).toThrowError("result is minus value");
    });

    test('times(): 5$ * 2 = 10$', (): void => {
        const factory = new MoneyFactory()
        const doller5 = factory.create(5, "USD")
        const bank = new Bank()
        const calculator = new Calculator(bank)
        const timedDoller = calculator.times(doller5, 2)
        expect(timedDoller.amount).toBe(10);
    });

    test('times(): 5$ * -2 = Error, 結果が負になった場合のエラー処理', (): void => {
        const factory = new MoneyFactory()
        const doller5 = factory.create(5, "USD")
        const bank = new Bank()
        const calculator = new Calculator(bank)
        expect(() => calculator.times(doller5, -2)).toThrowError("result is minus value");
    });

    test('5$ + 10CHF = 10 in case of rate 1:2', (): void => {
        const factory = new MoneyFactory()
        const doller5 = factory.create(5, "USD")
        const franc10 = factory.create(10, "CHF")
        const bank = new Bank()
        bank.addRate("CHF", "USD", 0.5)
        const calculator = new Calculator(bank)
        const resuletDoller = calculator.plus(doller5, franc10, "USD")
        expect(resuletDoller.amount === 10 && resuletDoller.currency === "USD").toBe(true);
    });

    test('5$ - 8CHF = 1 in case of rate 1:2', (): void => {
        const factory = new MoneyFactory()
        const doller5 = factory.create(5, "USD")
        const franc10 = factory.create(8, "CHF")
        const bank = new Bank()
        bank.addRate("CHF", "USD", 0.5)
        const calculator = new Calculator(bank)
        const resuletDoller = calculator.reduce(doller5, franc10, "USD")
        expect(resuletDoller.amount === 1 && resuletDoller.currency === "USD").toBe(true);
    });

    test('5$ = $5', (): void => {
        const factory = new MoneyFactory()
        const doller5 = factory.create(5, "USD")
        const bank = new Bank()
        const calculator = new Calculator(bank)
        expect(calculator.equals(doller5, doller5)).toBe(true);
    });

    test('5$ = $10: 数量が違う場合falseを返す', (): void => {
        const factory = new MoneyFactory()
        const doller5 = factory.create(5, "USD")
        const doller10 = factory.create(10, "USD")
        const bank = new Bank()
        const calculator = new Calculator(bank)
        expect(calculator.equals(doller5, doller10)).toBe(false);
    });

    test('5$ = fran5: 通貨が違う場合falseを返す', (): void => {
        const factory = new MoneyFactory()
        const doller5 = factory.create(5, "USD")
        const franc5 = factory.create(5, "CHF")
        const bank = new Bank()
        const calculator = new Calculator(bank)
        expect(calculator.equals(doller5, franc5)).toBe(false);
    });
})

describe('bank class', (): void => {
    test('add rate to bank', (): void => {
        const bank = new Bank()
        bank.addRate("USD", "CHF", 0.5)
        expect(bank.getRate("USD", "CHF")).toBe(0.5);
    });

    test('if put minus number to addrate, throw error', (): void => {
        const bank = new Bank()
        expect(() => bank.addRate("USD", "CHF", -0.5)).toThrowError("rate is minus");
    });

    test('throw unknown rate error', (): void => {
        const bank = new Bank()
        bank.addRate("USD", "CHF", 0.5)
        expect(() => bank.getRate("CHF", "USD")).toThrowError("unknown rate");
    });

    test('return 1 if from and to is same', (): void => {
        const bank = new Bank()
        expect(bank.getRate("USD", "USD")).toBe(1);
    });

    test('exchange $10 USD to 5 CHF in case of 0.5 rate', (): void => {
        const factory = new MoneyFactory()
        const doller10 = factory.create(10, "USD")
        const bank = new Bank()
        bank.addRate("USD", "CHF", 0.5)
        const franc = bank.exchange(doller10, "CHF")
        expect(franc.amount === 5 && franc.currency === "CHF").toBe(true);
    });
})

