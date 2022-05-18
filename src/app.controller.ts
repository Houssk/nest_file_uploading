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
import { AppService,  EventDemo } from './app.service';
//import {PythonShell} from 'python-shell';

@Controller()
export class AppController {
  constructor(private readonly eventDemo: EventDemo) {}
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
    
    const PythonShell = require('python-shell').PythonShell; //A MODIFIER

    let options = {
      // TODO 
        mode: 'text',
        pythonPath: 'C:/Users/FRFSIE_005/anaconda3/envs/environmentIA_YOLO2/python',
        scriptPath: 'C:/Users/FRFSIE_005/Desktop/IA_CyriaqueB/Code/YOLO_Hip_Landmark_Detection-main/universal_landmark_detection',
        args: [file.filename]
      };
      
    let pyshell = new PythonShell('detection.py', options);
    
    return pyshell.end(function(err){
      if (err){
        throw err;
      }
      
      console.log('finished') 
      
    });

    this.eventDemo.emitEvent()
    
    //var fs = require('fs');
    //var monJson = JSON.parse(fs.readFileSync('./files/'+file.filename+'_data.json', 'utf8'))

    //const response = {
    //    originalname: file.originalname,
    //    filename: file.filename,
    //    mimeType : file.mimeType,
    //    path : file.path,
    //    coord : monJson,
    //};
    //console.log(response)
  
    //return (response)
  }

  @OnEvent('close', { async: true })
    sendLandmarks() {
      //var fs = require('fs');
      //var monJson = JSON.parse(fs.readFileSync('./files/'+file.filename+'_data.json', 'utf8'))
  
      //const response = {
      //    originalname: file.originalname,
      //    filename: file.filename,
      //    mimeType : file.mimeType,
      //    path : file.path,
      //    coord : monJson,
      //};
      console.log('test')
    
      //return (response)
    }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './files' });
  }


  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
    )
  async uploadedFileSize(@UploadedFile() file) {
    const response = {
      filename: file.filename,
      size: file.size,
    };
  return response;
}
}
