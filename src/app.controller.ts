import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    Req,
    Query
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {editFileName, imageFileFilter} from './utils/file-uploading.utils';
import * as PATH from 'shared/path.constant';
import {Options} from 'python-shell';
import {PythonShell} from 'python-shell';

@Controller()
export class AppController {
    filename: string;
    // tslint:disable-next-line:no-empty
    constructor() {
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
        this.filename = file.filename

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
        
    @Post('detection')
    /**
     *  @Return Promise
     */
    async launchDetection(@Body() hipInfos) {
        const options: Options = {
            mode: 'text',
            pythonPath: PATH.PYTHON_PATH,
            scriptPath: PATH.SCRIPT_PATH,
            args: [this.filename, hipInfos[0]['nbrHip'], hipInfos[0]['side']],
        };
        
        if (this.filename === undefined){
            return {image: false}
        }
        else {
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
    }

    @Post('rodSize')
    /**
     *  @Return Promise
     */
    async findRodSize(@Body() rodData) {
        const options: Options = {
            mode: 'text',
            pythonPath: PATH.PYTHON_PATH,
            scriptPath: PATH.SCRIPT_PATH,
            args: [this.filename, rodData[0]['deltaCut'], rodData[0]['xDiaph'], rodData[0]['yDIaph'], rodData[0]['xTroch'], rodData[0]['yTroch'], rodData[0]['angle']],
        };
        console.log('size launched')
        return new Promise(resolve => {
            PythonShell.run('rodSizeSelector.py', options, (err, result) => {
                if (err) {
                    throw err;
                }
                console.log(result);
                resolve(result)
            });
        }); 
    }


    /**
     * @param fileName
     */
    listenToAnswer(fileName: string, extension: string) {
        console.log('Message Received: ', fileName);
        const fs = require('fs');
        return [JSON.parse(fs.readFileSync(`${PATH.FILE_DIR}/${fileName}_${extension}`, 'utf8')), fileName];
    }


}
