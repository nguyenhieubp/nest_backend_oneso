import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('file')
@ApiTags('Upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  uploadFile(@Res() res: Response, @UploadedFile() file: Express.Multer.File) {
    const imagePath = path.join(__dirname, '../../uploads', file.filename);
    res.sendFile(imagePath);
  }

  @Get('/getFile/:fileName')
  getFile(@Res() res: Response, @Param('fileName') file: string) {
    const imagePath = path.join(__dirname, '../../uploads/', file);
    res.sendFile(imagePath);
  }
}
