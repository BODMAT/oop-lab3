"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const files = Array.from({ length: 20 }, (_, i) => `${10 + i}.txt`);
const missingFiles = [];
const badDataFiles = [];
const overflowFiles = [];
let products = [];
class FileMissingError extends Error {
    constructor(message) {
        super(message);
        this.name = "FileMissingError";
        console.error(message);
    }
}
class BadDataError extends Error {
    constructor(message) {
        super(message);
        this.name = "BadDataError";
        console.error(message);
    }
}
class OverflowError extends Error {
    constructor(message) {
        super(message);
        this.name = "OverflowError";
        console.error(message);
    }
}
function getNumberFromLine(line, file) {
    try {
        /^(?:[-]?\d+)$/.exec(line.trim()) ?? (() => { throw new Error(); })();
        const num = parseInt(line.trim(), 10);
        return num;
    }
    catch {
        throw new BadDataError(`Некоректні дані (${line.trim()}) в ${file}`);
    }
}
function checkOverflow(product, file) {
    try {
        const int32Min = -2147483648;
        const int32Max = 2147483647;
        product < int32Min || product > int32Max ? (() => { throw new Error(); })() : null;
    }
    catch (error) {
        throw new OverflowError(`Переповнення 32-бітного int ${file}`);
    }
}
for (const file of files) {
    try {
        try {
            fs.accessSync(path.join(__dirname, "..", "inputs", file), fs.constants.F_OK);
        }
        catch {
            throw new FileMissingError(`Файл відсутній ${file}`);
        }
        const content = fs.readFileSync(path.join(__dirname, "..", "inputs", file), 'utf-8').trim();
        const lines = content.split('\n');
        const num1 = (() => { return getNumberFromLine(lines[0], file); })();
        const num2 = (() => { return getNumberFromLine(lines[1], file); })();
        const product = num1 * num2;
        checkOverflow(product, file);
        products.push(product);
    }
    catch (error) {
        switch (true) {
            case error instanceof FileMissingError:
                missingFiles.push(file);
                break;
            case error instanceof BadDataError:
                badDataFiles.push(file);
                break;
            case error instanceof OverflowError:
                overflowFiles.push(file);
                break;
        }
    }
}
try {
    const totalSum = products.reduce((sum, prod) => sum + prod);
    const average = totalSum / products.length;
    console.log(`Середнє арифметичне добутків: ${average}`);
}
catch (error) {
    console.error("Не вдалося обчислити середнє арифметичне, оскільки масив добутків порожній.");
}
try {
    fs.writeFileSync(path.join(__dirname, "..", "outputs", 'no_file.txt'), missingFiles.join('\n'), 'utf-8');
    fs.writeFileSync(path.join(__dirname, "..", "outputs", 'bad_data.txt'), badDataFiles.join('\n'), 'utf-8');
    fs.writeFileSync(path.join(__dirname, "..", "outputs", 'overflow.txt'), overflowFiles.join('\n'), 'utf-8');
}
catch (err) {
    throw new Error("Невдалося створити файл", err);
}
