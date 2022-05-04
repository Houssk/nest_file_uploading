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
    const response = {
      originalname: file.originalname,
      filename: file.filename,
      mimeType : file.mimeType,
      path : file.path,
      work : "done"
    };
    return response;
  }

  @Post()
  runDetection(@UploadedFile() file) {
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python', ["C:/Users/FRFSIE_005/Desktop/IA_CyriaqueB/Code/YOLO_Hip_Landmark_Detection-main/detection.py", file.filename]);
    
    pythonProcess.stdout.on('data', function(data) {

      console.log(data.toString());
    });
    const response = {
      work : "done"
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
