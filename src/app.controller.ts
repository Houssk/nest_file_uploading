import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {editFileName, imageFileFilter} from './utils/file-uploading.utils';
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { AppService} from './app.service';
import { PythonShellError } from 'python-shell';
//import {PythonShell} from 'python-shell';

@Controller()
export class AppController {
  constructor(private eventDemo: AppService) {}

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
  
  async uploadedFile(@UploadedFile() file) {
    
    let options = {
      // TODO 
        mode: 'text',
        pythonPath: 'C:/Users/FRFSIE_005/anaconda3/envs/environmentIA_YOLO2/python',
        scriptPath: 'C:/Users/FRFSIE_005/Desktop/IA_CyriaqueB/Code/YOLO_Hip_Landmark_Detection-main/universal_landmark_detection',
        args: [file.filename]
      };

    const PythonShell = require('python-shell').PythonShell; //A MODIFIER

    let pyshell = new PythonShell('detection.py', options);
    
    pyshell.end(err =>{
      if (err){
        throw err;
      }
      console.log('finished') 
      this.eventDemo.emitEvent(file.filename);
    });
  
    const response = {
      filename: file.filename,
    };

    return response
  }


  @OnEvent('json.created')
  listenToEvent(msg: string) {
    console.log('Message Received: ', msg)
    var fs = require('fs');
    var monJson = JSON.parse(fs.readFileSync('./files/'+msg+'_data.json', 'utf8'))
    return monJson
}


  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './files' });
  }

}