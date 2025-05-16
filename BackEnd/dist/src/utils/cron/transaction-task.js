"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoExpireTransactionsTask = AutoExpireTransactionsTask;
exports.AutoCancelTransactionsTask = AutoCancelTransactionsTask;
const node_cron_1 = __importDefault(require("node-cron"));
const transaction_service_1 = require("../../services/transaction.service");
function AutoExpireTransactionsTask() {
    return __awaiter(this, void 0, void 0, function* () {
        node_cron_1.default.schedule("*/10 * * * *", () => __awaiter(this, void 0, void 0, function* () {
            console.log("Running cron: expire unpaid transactions");
            yield (0, transaction_service_1.AutoExpireTransactions)();
        }));
    });
}
function AutoCancelTransactionsTask() {
    return __awaiter(this, void 0, void 0, function* () {
        node_cron_1.default.schedule("0 * * * *", () => __awaiter(this, void 0, void 0, function* () {
            console.log("Running cron: cancel unconfirmed transactions");
            yield (0, transaction_service_1.AutoCancelTransactions)();
        }));
    });
}
