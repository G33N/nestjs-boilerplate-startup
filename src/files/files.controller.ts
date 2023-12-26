import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';
import { CreateRowFileDto } from './dto/create-row-file.dto';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    return this.filesService.uploadFile(file);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('listing/:listingId')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'listingCover', maxCount: 1 },
      { name: 'listingImages', maxCount: 9 },
    ]),
  )
  async uploadImages(
    @Param('listingId') listingId: string,
    @UploadedFiles()
    files: {
      listingCover?: Express.Multer.File[];
      listingImages?: Express.Multer.File[];
    },
  ) {
    return this.filesService.uploadFiles(files);
  }

  @Post('presigned-url')
  getPresignedUrls(
    @Body()
    files: { filename: string; mimetype: string }[],
  ) {
    return this.filesService.getPresignedUrls(files);
  }

  @Post('')
  create(
    @Body()
    body: CreateRowFileDto,
  ) {
    return this.filesService.create(body);
  }

  @Get(':path')
  download(@Param('path') path, @Response() response) {
    return response.sendFile(path, { root: './files' });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findMany({ id });
  }
}
