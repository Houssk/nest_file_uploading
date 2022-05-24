import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {editFileName, imageFileFilter} from './utils/file-uploading.utils';
import * as PATH from 'shared/path.constant';
import {Options} from 'python-shell';
import {PythonShell} from 'python-shell';

@Controller()
export class AppController {
    constructor() {
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './files',
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
        const options: Options = {
            mode: 'text',
            pythonPath: PATH.PYTHON_PATH,
            scriptPath: PATH.SCRIPT_PATH,
            args: [file.filename],
        };

        return new Promise(resolve => {
            PythonShell.run('detection.py', options, (err, result) => {
                if (err) {
                    throw err;
                }
                console.log(result);
                resolve(this.listenToEvent(file.filename));
            });
        });
    }
    /**
     * @param msg
     */
    listenToEvent(msg: string) {
        console.log('Message Received: ', msg);
        const fs = require('fs');
        return JSON.parse(fs.readFileSync('./files/' + msg + '_data.json', 'utf8'));
    }
}
