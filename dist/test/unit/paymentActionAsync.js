"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var utils = require("../utils");
var Web3 = require('web3');
var requestNetwork_1 = require("../../src/requestNetwork");
var artifacts_1 = require("../../src/artifacts");
var addressRequestEthereum = artifacts_1.default.RequestEthereumArtifact.networks.private.address;
var addressSynchroneExtensionEscrow = artifacts_1.default.RequestSynchroneExtensionEscrowArtifact.networks.private.address;
var rn;
var web3;
var defaultAccount;
var payer;
var payee;
var otherGuy;
var coreVersion;
var currentNumRequest;
var requestId;
describe('paymentAction', function () {
    var arbitraryAmount = 100000000;
    rn = new requestNetwork_1.default();
    web3 = rn.requestEthereumService.web3Single.web3;
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        var accounts, req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3.eth.getAccounts()];
                case 1:
                    accounts = _a.sent();
                    defaultAccount = accounts[0].toLowerCase();
                    payer = accounts[2].toLowerCase();
                    payee = accounts[3].toLowerCase();
                    otherGuy = accounts[4].toLowerCase();
                    return [4 /*yield*/, rn.requestCoreService.getVersionAsync()];
                case 2:
                    coreVersion = _a.sent();
                    return [4 /*yield*/, rn.requestCoreService.getCurrentNumRequestAsync()];
                case 3:
                    currentNumRequest = _a.sent();
                    return [4 /*yield*/, rn.requestEthereumService.createRequestAsPayee(payer, arbitraryAmount, '', '', [], { from: payee })];
                case 4:
                    req = _a.sent();
                    requestId = req.request.requestId;
                    return [2 /*return*/];
            }
        });
    }); });
    it('pay request', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, arbitraryAmount, 0, { from: payer })
                            .on('broadcasted', function (data) {
                            chai_1.expect(data, 'data.transactionHash is wrong').to.have.property('transactionHash');
                        })];
                case 2:
                    result = _a.sent();
                    utils.expectEqualsBN(result.request.expectedAmount, arbitraryAmount, 'expectedAmount is wrong');
                    utils.expectEqualsBN(result.request.balance, arbitraryAmount, 'balance is wrong');
                    chai_1.expect(result.request.creator.toLowerCase(), 'creator is wrong').to.equal(payee);
                    chai_1.expect(result.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(result.request.payee.toLowerCase(), 'payee is wrong').to.equal(payee);
                    chai_1.expect(result.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(result.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(result.request.state, 'state is wrong').to.equal('1');
                    chai_1.expect(result.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    chai_1.expect(result, 'result.transactionHash is wrong').to.have.property('transactionHash');
                    return [2 /*return*/];
            }
        });
    }); });
    it('pay request with additional', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, arbitraryAmount, 10, { from: payer })];
                case 2:
                    result = _a.sent();
                    utils.expectEqualsBN(result.request.expectedAmount, arbitraryAmount + 10, 'expectedAmount is wrong');
                    utils.expectEqualsBN(result.request.balance, arbitraryAmount, 'balance is wrong');
                    chai_1.expect(result.request.creator.toLowerCase(), 'creator is wrong').to.equal(payee);
                    chai_1.expect(result.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(result.request.payee.toLowerCase(), 'payee is wrong').to.equal(payee);
                    chai_1.expect(result.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(result.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(result.request.state, 'state is wrong').to.equal('1');
                    chai_1.expect(result.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    chai_1.expect(result, 'result.transactionHash is wrong').to.have.property('transactionHash');
                    return [2 /*return*/];
            }
        });
    }); });
    it('pay request with not valid requestId', function () { return __awaiter(_this, void 0, void 0, function () {
        var result, result_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    result = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction('0x00000000000000', arbitraryAmount, 0, { from: payer })];
                case 3:
                    result_1 = _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    utils.expectEqualsObject(e_1, Error('_requestId must be a 32 bytes hex string (eg.: \'0x0000000000000000000000000000000000000000000000000000000000000000\''), 'exception not right');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it('pay request with not valid additional', function () { return __awaiter(_this, void 0, void 0, function () {
        var result, result_2, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    result = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, arbitraryAmount, -1, { from: payer })];
                case 3:
                    result_2 = _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    utils.expectEqualsObject(e_2, Error('_additional must a positive integer'), 'exception not right');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it('pay request with not valid amount', function () { return __awaiter(_this, void 0, void 0, function () {
        var result, result_3, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    result = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, -1, 0, { from: payer })];
                case 3:
                    result_3 = _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _a.sent();
                    utils.expectEqualsObject(e_3, Error('_amount must a positive integer'), 'exception not right');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it('pay request canceled', function () { return __awaiter(_this, void 0, void 0, function () {
        var result, result_4, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.cancel(requestId, { from: payer })];
                case 1:
                    result = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, arbitraryAmount, 0, { from: payer })];
                case 3:
                    result_4 = _a.sent();
                    chai_1.expect(false, 'exception not thrown').to.be.true;
                    return [3 /*break*/, 5];
                case 4:
                    e_4 = _a.sent();
                    utils.expectEqualsObject(e_4, Error('request must be accepted'), 'exception not right');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    it('pay request created', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, arbitraryAmount, 0, { from: payer })
                        .on('broadcasted', function (data) {
                        chai_1.expect(data, 'data.transactionHash is wrong').to.have.property('transactionHash');
                    })];
                case 1:
                    result = _a.sent();
                    utils.expectEqualsBN(result.request.expectedAmount, arbitraryAmount, 'expectedAmount is wrong');
                    utils.expectEqualsBN(result.request.balance, arbitraryAmount, 'balance is wrong');
                    chai_1.expect(result.request.creator.toLowerCase(), 'creator is wrong').to.equal(payee);
                    chai_1.expect(result.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(result.request.payee.toLowerCase(), 'payee is wrong').to.equal(payee);
                    chai_1.expect(result.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(result.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(result.request.state, 'state is wrong').to.equal('1');
                    chai_1.expect(result.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    chai_1.expect(result, 'result.transactionHash is wrong').to.have.property('transactionHash');
                    return [2 /*return*/];
            }
        });
    }); });
    it('pay request with additional higher than amount', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, 1, 2, { from: payer })
                            .on('broadcasted', function (data) {
                            chai_1.expect(data, 'data.transactionHash is wrong').to.have.property('transactionHash');
                        })];
                case 2:
                    result = _a.sent();
                    utils.expectEqualsBN(result.request.expectedAmount, arbitraryAmount + 2, 'expectedAmount is wrong');
                    utils.expectEqualsBN(result.request.balance, 1, 'balance is wrong');
                    chai_1.expect(result.request.creator.toLowerCase(), 'creator is wrong').to.equal(payee);
                    chai_1.expect(result.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(result.request.payee.toLowerCase(), 'payee is wrong').to.equal(payee);
                    chai_1.expect(result.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(result.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(result.request.state, 'state is wrong').to.equal('1');
                    chai_1.expect(result.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    chai_1.expect(result, 'result.transactionHash is wrong').to.have.property('transactionHash');
                    return [2 /*return*/];
            }
        });
    }); });
    it('pay request with higher amount than expected', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rn.requestEthereumService.accept(requestId, { from: payer })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, rn.requestEthereumService.paymentAction(requestId, arbitraryAmount + 1, 0, { from: payer })
                            .on('broadcasted', function (data) {
                            chai_1.expect(data, 'data.transactionHash is wrong').to.have.property('transactionHash');
                        })];
                case 2:
                    result = _a.sent();
                    utils.expectEqualsBN(result.request.expectedAmount, arbitraryAmount, 'expectedAmount is wrong');
                    utils.expectEqualsBN(result.request.balance, arbitraryAmount + 1, 'balance is wrong');
                    chai_1.expect(result.request.creator.toLowerCase(), 'creator is wrong').to.equal(payee);
                    chai_1.expect(result.request.extension, 'extension is wrong').to.be.undefined;
                    chai_1.expect(result.request.payee.toLowerCase(), 'payee is wrong').to.equal(payee);
                    chai_1.expect(result.request.payer.toLowerCase(), 'payer is wrong').to.equal(payer);
                    chai_1.expect(result.request.requestId, 'requestId is wrong').to.equal(utils.getHashRequest(coreVersion, ++currentNumRequest));
                    chai_1.expect(result.request.state, 'state is wrong').to.equal('1');
                    chai_1.expect(result.request.currencyContract.address.toLowerCase(), 'currencyContract is wrong').to.equal(addressRequestEthereum);
                    chai_1.expect(result, 'result.transactionHash is wrong').to.have.property('transactionHash');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=paymentActionAsync.js.map