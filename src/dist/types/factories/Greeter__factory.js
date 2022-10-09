"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Greeter__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
var ethers_1 = require("ethers");
var _abi = [
    {
        inputs: [],
        name: "addGreet",
        outputs: [],
        stateMutability: "payable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "person",
                type: "address"
            },
        ],
        name: "getGreetCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "person",
                type: "address"
            },
        ],
        name: "getGreets",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
            },
        ],
        name: "withdrawGreet",
        outputs: [],
        stateMutability: "payable",
        type: "function"
    },
];
var _bytecode = "0x608060405234801561001057600080fd5b50610706806100206000396000f3fe60806040526004361061003f5760003560e01c80630d0de4ac14610044578063274a577f146100605780637bc86f6c1461006a57806398c2cb6c146100a7575b600080fd5b61005e6004803603810190610059919061052d565b6100e4565b005b610068610200565b005b34801561007657600080fd5b50610091600480360381019061008c91906105b8565b610306565b60405161009e91906105f4565b60405180910390f35b3480156100b357600080fd5b506100ce60048036038101906100c991906105b8565b61034f565b6040516100db91906105f4565b60405180910390f35b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054106101fd57806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610173919061063e565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156101fb573d6000803e3d6000fd5b505b50565b61020933610397565b61021234610430565b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546102609190610672565b9250508190555060018060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546102b69190610672565b925050819055506103046000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054610430565b565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b61042d816040516024016103ab91906106b5565b6040516020818303038152906040527f2c2ecbc2000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506104c9565b50565b6104c68160405160240161044491906105f4565b6040516020818303038152906040527ff82c50f1000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506104c9565b50565b60008151905060006a636f6e736f6c652e6c6f679050602083016000808483855afa5050505050565b600080fd5b6000819050919050565b61050a816104f7565b811461051557600080fd5b50565b60008135905061052781610501565b92915050565b600060208284031215610543576105426104f2565b5b600061055184828501610518565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006105858261055a565b9050919050565b6105958161057a565b81146105a057600080fd5b50565b6000813590506105b28161058c565b92915050565b6000602082840312156105ce576105cd6104f2565b5b60006105dc848285016105a3565b91505092915050565b6105ee816104f7565b82525050565b600060208201905061060960008301846105e5565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610649826104f7565b9150610654836104f7565b925082820390508181111561066c5761066b61060f565b5b92915050565b600061067d826104f7565b9150610688836104f7565b92508282019050808211156106a05761069f61060f565b5b92915050565b6106af8161057a565b82525050565b60006020820190506106ca60008301846106a6565b9291505056fea2646970667358221220df2abc9f72e093976309816a9e1b7034f13e7cb2efd83ea50a4dc93f9408825364736f6c63430008110033";
var isSuperArgs = function (xs) { return xs.length > 1; };
var Greeter__factory = /** @class */ (function (_super) {
    __extends(Greeter__factory, _super);
    function Greeter__factory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = this;
        if (isSuperArgs(args)) {
            _this = _super.apply(this, args) || this;
        }
        else {
            _this = _super.call(this, _abi, _bytecode, args[0]) || this;
        }
        return _this;
    }
    Greeter__factory.prototype.deploy = function (overrides) {
        return _super.prototype.deploy.call(this, overrides || {});
    };
    Greeter__factory.prototype.getDeployTransaction = function (overrides) {
        return _super.prototype.getDeployTransaction.call(this, overrides || {});
    };
    Greeter__factory.prototype.attach = function (address) {
        return _super.prototype.attach.call(this, address);
    };
    Greeter__factory.prototype.connect = function (signer) {
        return _super.prototype.connect.call(this, signer);
    };
    Greeter__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    Greeter__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    Greeter__factory.bytecode = _bytecode;
    Greeter__factory.abi = _abi;
    return Greeter__factory;
}(ethers_1.ContractFactory));
exports.Greeter__factory = Greeter__factory;
