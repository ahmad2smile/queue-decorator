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
Object.defineProperty(exports, "__esModule", { value: true });
function Queue(predicate) {
    return (target, key, descriptor) => {
        const original = descriptor.value;
        let context;
        const queued = [];
        let inProgress = [];
        const caller = (entity, resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (inProgress.some(a => predicate(a.entity, entity))) {
                queued.push({
                    entity,
                    resolve,
                    reject,
                });
            }
            else {
                inProgress.unshift({
                    entity,
                    resolve,
                    reject,
                });
                try {
                    const result = yield original.apply(context, [
                        entity,
                        resolve,
                        reject,
                    ]);
                    resolve(result);
                    inProgress = inProgress.filter(a => !predicate(a.entity, entity));
                    const firstQueued = queued.pop();
                    if (firstQueued) {
                        caller(firstQueued.entity, firstQueued.resolve, firstQueued.reject);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }
        });
        descriptor.value = function (entity) {
            if (!context) {
                // @ts-ignore
                context = this;
            }
            return new Promise((resolve, reject) => {
                caller(entity, resolve, reject);
            });
        };
        return descriptor;
    };
}
exports.Queue = Queue;
