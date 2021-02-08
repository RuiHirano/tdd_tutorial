"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bank = exports.Calculator = exports.MoneyFactory = exports.Franc = exports.Doller = exports.Money = void 0;
var Money = /** @class */ (function () {
    function Money(amount, currency) {
        if (amount < 0)
            throw new Error("result is minus value");
        this.amount = amount;
        this.currency = currency;
    }
    return Money;
}());
exports.Money = Money;
var Doller = /** @class */ (function (_super) {
    __extends(Doller, _super);
    function Doller(amount) {
        var _this = this;
        var currency = "USD";
        _this = _super.call(this, amount, currency) || this;
        return _this;
    }
    return Doller;
}(Money));
exports.Doller = Doller;
var Franc = /** @class */ (function (_super) {
    __extends(Franc, _super);
    function Franc(amount) {
        var _this = this;
        var currency = "CHF";
        _this = _super.call(this, amount, currency) || this;
        return _this;
    }
    return Franc;
}(Money));
exports.Franc = Franc;
var MoneyFactory = /** @class */ (function () {
    function MoneyFactory() {
    }
    MoneyFactory.prototype.create = function (amount, state) {
        switch (state) {
            case "USD":
                return new Doller(amount);
            case "CHF":
                return new Franc(amount);
            default:
                throw new Error("unknown currency");
        }
    };
    return MoneyFactory;
}());
exports.MoneyFactory = MoneyFactory;
var Calculator = /** @class */ (function () {
    function Calculator(bank) {
        this.factory = new MoneyFactory();
        this.bank = bank;
    }
    Calculator.prototype.plus = function (money1, money2, currency) {
        var amount = this.bank.exchange(money1, currency).amount + this.bank.exchange(money2, currency).amount;
        return this.factory.create(amount, currency);
    };
    Calculator.prototype.reduce = function (money1, money2, currency) {
        var amount = this.bank.exchange(money1, currency).amount - this.bank.exchange(money2, currency).amount;
        return this.factory.create(amount, currency);
    };
    Calculator.prototype.times = function (money, multiplier) {
        var newAmount = money.amount * multiplier;
        return this.factory.create(newAmount, money.currency);
    };
    Calculator.prototype.equals = function (money1, money2) {
        return money1.amount === money2.amount && money1.currency === money2.currency;
    };
    return Calculator;
}());
exports.Calculator = Calculator;
var Bank = /** @class */ (function () {
    function Bank() {
        this.rateMap = new Map();
        this.factory = new MoneyFactory();
    }
    Bank.prototype.addRate = function (from, to, rate) {
        if (rate < 0) {
            throw new Error("rate is minus");
        }
        this.rateMap.set(from, new Map().set(to, rate));
    };
    Bank.prototype.getRate = function (from, to) {
        var _a;
        if (from === to)
            return 1;
        var rate = (_a = this.rateMap.get(from)) === null || _a === void 0 ? void 0 : _a.get(to);
        if (rate === undefined) {
            throw new Error("unknown rate");
        }
        return rate;
    };
    Bank.prototype.exchange = function (money, to) {
        var rate = this.getRate(money.currency, to);
        return this.factory.create(money.amount * rate, to);
    };
    return Bank;
}());
exports.Bank = Bank;
var main = function () {
    var factory = new MoneyFactory();
    var doller5 = factory.create(7, "USD");
    var franc10 = factory.create(10, "CHF");
    var bank = new Bank();
    bank.addRate("USD", "CHF", 2);
    bank.addRate("CHF", "USD", 0.5);
    var calclator = new Calculator(bank);
    var isEquals = calclator.equals(doller5, franc10);
    var isEquals2 = calclator.equals(doller5, doller5);
    var plusedMoney = calclator.plus(doller5, franc10, "CHF");
    var reducedMoney = calclator.reduce(doller5, franc10, "USD");
    console.log("isEquals " + isEquals + " " + isEquals2 + ", plusedMoney: " + plusedMoney.amount + " " + plusedMoney.currency + ", reducedMoney: " + reducedMoney.amount + " " + reducedMoney.currency);
};
main();
