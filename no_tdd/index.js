'use strict';
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
var Money = /** @class */ (function () {
    function Money(amount, currency) {
        this.amount = amount;
        this.currency = currency;
    }
    return Money;
}());
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
var Calculator = /** @class */ (function () {
    function Calculator(bank) {
        this.bank = bank;
    }
    // かけ算
    Calculator.prototype.times = function (money, multiplier) {
        return new Money(money.amount * multiplier, money.currency);
    };
    // return added money by money2 currency type   money1 + money2
    Calculator.prototype.plus = function (money1, money2, currency) {
        var amount = this.bank.exchange(money1, currency).amount + this.bank.exchange(money2, currency).amount;
        return new Money(amount, money2.currency);
    };
    // money1 - money2
    Calculator.prototype.reduce = function (money1, money2, currency) {
        var amount = this.bank.exchange(money1, currency).amount - this.bank.exchange(money2, currency).amount;
        if (amount < 0) {
            throw new Error("culculated amount is minus");
        }
        return new Money(amount, currency);
    };
    Calculator.prototype.equals = function (money1, money2) {
        return money1.amount === money2.amount && money1.currency === money2.currency;
    };
    return Calculator;
}());
var RateData = /** @class */ (function () {
    function RateData() {
        this.pairMap = new Map();
    }
    RateData.prototype.addRate = function (pair) {
        this.pairMap.set(pair.from, new Map().set(pair.to, pair));
        //this.pairMap[pair.from][pair.to] = pair
    };
    RateData.prototype.getRate = function (money, tgtCurrancy) {
        var _a;
        if (money.currency === tgtCurrancy)
            return 1;
        var pair = (_a = this.pairMap.get(money.currency)) === null || _a === void 0 ? void 0 : _a.get(tgtCurrancy);
        if (pair === undefined) {
            throw new Error("unknown rate");
        }
        return pair.rate;
    };
    return RateData;
}());
var Bank = /** @class */ (function () {
    // 為替に従い変換するクラス
    function Bank(rateData) {
        this.rateData = rateData;
        this.factory = new CurrencyFactory();
    }
    Bank.prototype.exchange = function (money, tgtCurrancy) {
        var rate = this.rateData.getRate(money, tgtCurrancy);
        var newAmount = money.amount * rate;
        var newMoney = this.factory.create(newAmount, tgtCurrancy);
        return newMoney;
    };
    return Bank;
}());
var CurrencyFactory = /** @class */ (function () {
    // 通貨生成クラス
    function CurrencyFactory() {
    }
    CurrencyFactory.prototype.create = function (amount, type) {
        switch (type) {
            case "USD":
                return new Doller(amount);
            case "CHF":
                return new Franc(amount);
            default:
                throw new Error("ERROR: currency type is not exist.");
        }
    };
    return CurrencyFactory;
}());
var main = function () {
    var factory = new CurrencyFactory();
    var doller5 = factory.create(7, "USD");
    var franc10 = factory.create(10, "CHF");
    var rateData = new RateData();
    rateData.addRate({ from: "USD", to: "CHF", rate: 2 });
    rateData.addRate({ from: "CHF", to: "USD", rate: 0.5 });
    var bank = new Bank(rateData);
    var calclator = new Calculator(bank);
    var isEquals = calclator.equals(doller5, franc10);
    var isEquals2 = calclator.equals(doller5, doller5);
    var plusedMoney = calclator.plus(doller5, franc10, "CHF");
    var reducedMoney = calclator.reduce(doller5, franc10, "USD");
    console.log("isEquals " + isEquals + " " + isEquals2 + ", plusedMoney: " + plusedMoney.amount + " " + plusedMoney.currency + ", reducedMoney: " + reducedMoney.amount + " " + reducedMoney.currency);
};
main();
