import * as fs from 'fs';
import * as path from 'path';

const files = Array.from({ length: 20 }, (_, i) => `${10 + i}.txt`);
const missingFiles: string[] = [];
const badDataFiles: string[] = [];
const overflowFiles: string[] = [];
let products: number[] = [];

class FileMissingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FileMissingError";
        console.error(message);
    }
}

class BadDataError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadDataError";
        console.error(message);
    }
}

class OverflowError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "OverflowError";
        console.error(message);

    }
}

function getNumberFromLine(line: string, file: string): number {
    try {
        // Кидаємо помилку, якщо рядок не є цілим числом
        /^(?:[-]?\d+)$/.exec(line.trim()) ?? (() => { throw new Error() })();

        const num = parseInt(line.trim(), 10);
        return num
    } catch {
        throw new BadDataError(`Некоректні дані (${line.trim()}) в ${file}`);
    }
}


//! Функція для перевірки переповнення 32-бітного int
function checkOverflow(product: number, file: string): void {
    try {
        const int32Min = -2147483648;
        const int32Max = 2147483647;
        product < int32Min || product > int32Max ? (() => { throw new Error() })() : null;
    } catch (error) {
        throw new OverflowError(`Переповнення 32-бітного int ${file}`)
    }
}

for (const file of files) {
    try {
        try {
            fs.accessSync(path.join(__dirname, "..", "inputs", file), fs.constants.F_OK);
        } catch {
            throw new FileMissingError(`Файл відсутній ${file}`);
        }

        const content = fs.readFileSync(path.join(__dirname, "..", "inputs", file), 'utf-8').trim();
        const lines = content.split('\n');

        const num1 = (() => { return getNumberFromLine(lines[0], file) })();
        const num2 = (() => { return getNumberFromLine(lines[1], file) })();


        const product = num1 * num2;
        checkOverflow(product, file);
        //console.log(num1, num2, file);
        products.push(product);

    } catch (error) {
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
    const totalSum = products.reduce((sum, prod) => sum + prod); // Викине помилку, якщо products порожній
    const average = totalSum / products.length;
    console.log(`Середнє арифметичне добутків: ${average}`);
} catch (error) {
    console.error("Не вдалося обчислити середнє арифметичне, оскільки масив добутків порожній.");
}

try {
    fs.writeFileSync(path.join(__dirname, "..", "outputs", 'no_file.txt'), missingFiles.join('\n'), 'utf-8');
    fs.writeFileSync(path.join(__dirname, "..", "outputs", 'bad_data.txt'), badDataFiles.join('\n'), 'utf-8');
    fs.writeFileSync(path.join(__dirname, "..", "outputs", 'overflow.txt'), overflowFiles.join('\n'), 'utf-8');
} catch (err) {
    throw new Error("Невдалося створити файл", err)
}