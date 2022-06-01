import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile, Get,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {editFileName, imageFileFilter} from './utils/file-uploading.utils';
import * as PATH from 'shared/path.constant';
// @ts-ignore
import {Options} from 'python-shell';
// @ts-ignore
import {PythonShell} from 'python-shell';

@Controller()
export class AppController {
    filename: string;

    // tslint:disable-next-line:no-empty
    constructor() {
    }

    @Get()
    hello() {
        return 'this hello world';
    }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: PATH.FILE_DIR,
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )

    /**
     *  @Params @UploadedFile
     *  @Return Promise
     */
    async uploadedFile(@UploadedFile() file) {
        this.filename = file.filename;
        console.log(file);
        const options: Options = {
            mode: 'text',
            pythonPath: PATH.PYTHON_PATH,
            scriptPath: PATH.SCRIPT_CIRCLE_PATH,
            args: [this.filename],
        };
        return new Promise(resolve => {
            PythonShell.run('Size_Marker_Detector.py', options, (err) => {
                if (err) {
                    throw err;
                }
                resolve(this.listenToAnswer(this.filename, 'circle.json'));
            });
        });
    }

 /*   @Post('detection')
    async launchDetection() {
        const options: Options = {
            mode: 'text',
            pythonPath: PATH.PYTHON_PATH,
            scriptPath: PATH.SCRIPT_PATH,
            args: [this.filename],
        };
        if (this.filename === undefined) {
            return {image: false}
        } else {
            return new Promise(resolve => {
                PythonShell.run('detection.py', options, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    console.log(result);
                    resolve(this.listenToAnswer(this.filename, 'data.json'));
                });
            });
        }
    }*/

    /**
     * @param fileName
     * @param extension
     */
    listenToAnswer(fileName: string, extension: string) {
        console.log('Message Received: ', fileName);
        const fs = require('fs');
        return [JSON.parse(fs.readFileSync(`${PATH.FILE_DIR}/${fileName}_${extension}`, 'utf8')), fileName];
    }
}
