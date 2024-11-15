import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

async function processImages(directory: string) {
    const imageExtRegex = new RegExp("^((bmp)|(gif)|(tiff?)|(jpe?g)|(png))$", "i");

    try {
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const fileExt = path.extname(file).slice(1);

            //чи файл є зображенням
            if (!imageExtRegex.test(fileExt)) {
                console.log(`Файл не є зображенням: ${file}`);
                continue;
            }

            //чи файл вже відзеркалений
            if (file.includes('-mirrored')) {
                console.log(`Файл вже відзеркалений: ${file}`);
                continue;
            }

            const mirroredFilePath = path.join(directory, `${path.basename(file, path.extname(file))}-mirrored.gif`);

            try {
                await sharp(filePath)
                    .flop() // Віддзеркалення по горизонталі
                    .toFile(mirroredFilePath);

                console.log(`Зображення відзеркалено по горизонталі і збережено: ${mirroredFilePath}`);
            } catch (error) {
                console.error(`Помилка при обробці файлу ${file}: ${error.message}`);
            }
        }
    } catch (error) {
        console.error(`Помилка при читанні папки ${directory}: ${error.message}`);
    }
}

const directory = path.join(__dirname, "..", 'img');
processImages(directory).then(() => console.log("Обробка завершена."));
