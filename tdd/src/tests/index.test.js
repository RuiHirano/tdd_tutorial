"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("#/index");
describe('doller class', function () {
    test('doller(5) amount equals 5', function () {
        var doller = new index_1.Doller(5);
        expect(doller.amount).toBe(5);
    });
});
describe('franc class', function () {
    test('franc(5) amount equals 5', function () {
        var franc = new index_1.Franc(5);
        expect(franc.amount).toBe(5);
    });
});
describe('money class', function () {
    test('FrancがMoneyを継承している', function () {
        var franc = new index_1.Franc(5);
        expect(franc instanceof index_1.Money).toBe(true);
    });
    test('DollerがMoneyを継承している', function () {
        var doller = new index_1.Doller(5);
        expect(doller instanceof index_1.Money).toBe(true);
    });
    test('Moneyがamountを保持している', function () {
        var factory = new index_1.MoneyFactory();
        var doller = factory.create(5, "USD");
        expect(doller.amount).toBe(5);
    });
    test('Moneyがcurrencyを保持している', function () {
        var factory = new index_1.MoneyFactory();
        var doller = factory.create(5, "USD");
        expect(doller.currency).toBe("USD");
    });
    test('amountが負の場合にエラー', function () {
        var factory = new index_1.MoneyFactory();
        expect(function () { return factory.create(-5, "USD"); }).toThrowError("result is minus value");
    });
});
describe('factory class', function () {
    test('factory("CHF") create Franc Class', function () {
        var factory = new index_1.MoneyFactory();
        var franc = factory.create(5, "CHF");
        expect(franc instanceof index_1.Franc).toBe(true);
    });
    test('factory("USD") create Doller Class', function () {
        var factory = new index_1.MoneyFactory();
        var doller = factory.create(5, "USD");
        expect(doller instanceof index_1.Doller).toBe(true);
    });
    test('factory("USD") not equal Franc Class', function () {
        var factory = new index_1.MoneyFactory();
        var doller = factory.create(5, "USD");
        expect(doller instanceof index_1.Franc).toBe(false);
    });
});
describe('calculator class', function () {
    test('plus(): 5$ + 5$ = 10$', function () {
        var factory = new index_1.MoneyFactory();
        var doller5 = factory.create(5, "USD");
        var bank = new index_1.Bank();
        var calculator = new index_1.Calculator(bank);
        var plusedDoller = calculator.plus(doller5, doller5, "USD");
        expect(plusedDoller.amount).toBe(10);
    });
    test('reduce(): 10$ - 5$ = 5$', function () {
        var factory = new index_1.MoneyFactory();
        var doller10 = factory.create(10, "USD");
        var doller5 = factory.create(5, "USD");
        var bank = new index_1.Bank();
        var calculator = new index_1.Calculator(bank);
        var reducedDoller = calculator.reduce(doller10, doller5, "USD");
        expect(reducedDoller.amount).toBe(5);
    });
    test('reduce(): 10$ - 15$ = -5$ throw error, 結果が負になった場合のエラー処理', function () {
        var factory = new index_1.MoneyFactory();
        var doller10 = factory.create(10, "USD");
        var doller15 = factory.create(15, "USD");
        var bank = new index_1.Bank();
        var calculator = new index_1.Calculator(bank);
        expect(function () { return calculator.reduce(doller10, doller15, "USD"); }).toThrowError("result is minus value");
    });
    test('times(): 5$ * 2 = 10$', function () {
        var factory = new index_1.MoneyFactory();
        var doller5 = factory.create(5, "USD");
        var bank = new index_1.Bank();
        var calculator = new index_1.Calculator(bank);
        var timedDoller = calculator.times(doller5, 2);
        expect(timedDoller.amount).toBe(10);
    });
    test('times(): 5$ * -2 = Error, 結果が負になった場合のエラー処理', function () {
        var factory = new index_1.MoneyFactory();
        var doller5 = factory.create(5, "USD");
        var bank = new index_1.Bank();
        var calculator = new index_1.Calculator(bank);
        expect(function () { return calculator.times(doller5, -2); }).toThrowError("result is minus value");
    });
    test('5$ + 10CHF = 10 in case of rate 1:2', function () {
        var factory = new index_1.MoneyFactory();
        var doller5 = factory.create(5, "USD");
        var franc10 = factory.create(10, "CHF");
        var bank = new index_1.Bank();
        bank.addRate("CHF", "USD", 0.5);
        var calculator = new index_1.Calculator(bank);
        var resuletDoller = calculator.plus(doller5, franc10, "USD");
        expect(resuletDoller.amount === 10 && resuletDoller.currency === "USD").toBe(true);
    });
    test('5$ - 8CHF = 1 in case of rate 1:2', function () {
        var factory = new index_1.MoneyFactory();
        var doller5 = factory.create(5, "USD");
        var franc10 = factory.create(8, "CHF");
        var bank = new index_1.Bank();
        bank.addRate("CHF", "USD", 0.5);
        var calculator = new index_1.Calculator(bank);
        var resuletDoller = calculator.reduce(doller5, franc10, "USD");
        expect(resuletDoller.amount === 1 && resuletDoller.currency === "USD").toBe(true);
    });
    test('5$ = $5', function () {
        var factory = new index_1.MoneyFactory();
        var doller5 = factory.create(5, "USD");
        var bank = new index_1.Bank();
        var calculator = new index_1.Calculator(bank);
        expect(calculator.equals(doller5, doller5)).toBe(true);
    });
    test('5$ = $10: 数量が違う場合falseを返す', function () {
        var factory = new index_1.MoneyFactory();
        var doller5 = factory.create(5, "USD");
        var doller10 = factory.create(10, "USD");
        var bank = new index_1.Bank();
        var calculator = new index_1.Calculator(bank);
        expect(calculator.equals(doller5, doller10)).toBe(false);
    });
    test('5$ = fran5: 通貨が違う場合falseを返す', function () {
        var factory = new index_1.MoneyFactory();
        var doller5 = factory.create(5, "USD");
        var franc5 = factory.create(5, "CHF");
        var bank = new index_1.Bank();
        var calculator = new index_1.Calculator(bank);
        expect(calculator.equals(doller5, franc5)).toBe(false);
    });
});
describe('bank class', function () {
    test('add rate to bank', function () {
        var bank = new index_1.Bank();
        bank.addRate("USD", "CHF", 0.5);
        expect(bank.getRate("USD", "CHF")).toBe(0.5);
    });
    test('if put minus number to addrate, throw error', function () {
        var bank = new index_1.Bank();
        expect(function () { return bank.addRate("USD", "CHF", -0.5); }).toThrowError("rate is minus");
    });
    test('throw unknown rate error', function () {
        var bank = new index_1.Bank();
        bank.addRate("USD", "CHF", 0.5);
        expect(function () { return bank.getRate("CHF", "USD"); }).toThrowError("unknown rate");
    });
    test('return 1 if from and to is same', function () {
        var bank = new index_1.Bank();
        expect(bank.getRate("USD", "USD")).toBe(1);
    });
    test('exchange $10 USD to 5 CHF in case of 0.5 rate', function () {
        var factory = new index_1.MoneyFactory();
        var doller10 = factory.create(10, "USD");
        var bank = new index_1.Bank();
        bank.addRate("USD", "CHF", 0.5);
        var franc = bank.exchange(doller10, "CHF");
        expect(franc.amount === 5 && franc.currency === "CHF").toBe(true);
    });
});
