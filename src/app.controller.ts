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

@Controller()
export class AppController {
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
    const PythonShell = require('python-shell').PythonShell;

    var options = {
      mode: 'text',
      pythonPath: 'C:/Users/FRFSIE_005/anaconda3/envs/environmentIA_YOLO/python',
      scriptPath: 'C:/Users/FRFSIE_005/Desktop/IA_CyriaqueB/Code/YOLO_Hip_Landmark_Detection-main/universal_landmark_detection',
      args: [file.filename]
    };

    PythonShell.run('detection.py', options, function (err, results) {
      if (err) 
        throw err;
      // Results is an array consisting of messages collected during execution
      console.log('results: %j', results);
    });

    const response = {
      originalname: file.originalname,
      filename: file.filename,
      mimeType : file.mimeType,
      path : file.path,
    };
    return response;
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
