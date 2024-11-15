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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sharp_1 = __importDefault(require("sharp"));
async function processImages(directory) {
    const imageExtRegex = new RegExp("^((bmp)|(gif)|(tiff?)|(jpe?g)|(png))$", "i");
    try {
        const files = fs.readdirSync(directory);
        for (const file of files) {
            const filePath = path.join(directory, file);
            const fileExt = path.extname(file).slice(1);
            if (!imageExtRegex.test(fileExt)) {
                console.log(`Файл не є зображенням: ${file}`);
                continue;
            }
            if (file.includes('-mirrored')) {
                console.log(`Файл вже відзеркалений: ${file}`);
                continue;
            }
            const mirroredFilePath = path.join(directory, `${path.basename(file, path.extname(file))}-mirrored.gif`);
            try {
                await (0, sharp_1.default)(filePath)
                    .flop()
                    .toFile(mirroredFilePath);
                console.log(`Зображення відзеркалено по горизонталі і збережено: ${mirroredFilePath}`);
            }
            catch (error) {
                console.error(`Помилка при обробці файлу ${file}: ${error.message}`);
            }
        }
    }
    catch (error) {
        console.error(`Помилка при читанні папки ${directory}: ${error.message}`);
    }
}
const directory = path.join(__dirname, "..", 'img');
processImages(directory).then(() => console.log("Обробка завершена."));
