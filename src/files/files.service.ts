import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { CreateFileDto } from './dto/create-file.dto';
import * as AWS from 'aws-sdk';
import { CreateRowFileDto } from './dto/create-row-file.dto';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {}

  async uploadFile(file): Promise<FileEntity> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const path = {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: file.location,
    };

    return this.fileRepository.save(
      this.fileRepository.create({
        path: path[this.configService.get('file.driver')],
      }),
    );
  }

  public async uploadFiles(
    files,
  ): Promise<Array<{ file: FileEntity; priority: number }>> {
    if (!files) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      let listingImages: FileEntity[] = [];
      let listingCover: FileEntity[] = [];
      if (files?.listingImages?.length > 0) {
        listingImages = files?.listingImages?.map((file) => {
          const path = {
            local: `/${this.configService.get('app.apiPrefix')}/v1/${
              file.path
            }`,
            s3: file.location,
          };

          const result = this.fileRepository.save(
            this.fileRepository.create({
              path: path['s3'],
            }),
          );
          return result;
        });
      }
      if (files?.listingCover?.length > 0) {
        listingCover = files?.listingCover?.map((file) => {
          const path = {
            local: `/${this.configService.get('app.apiPrefix')}/v1/${
              file.path
            }`,
            s3: file.location,
          };

          const result = this.fileRepository.save(
            this.fileRepository.create({
              path: path['s3'],
            }),
          );
          return result;
        });
      }

      const resultListingCover = await Promise.all(listingCover);
      const resultListingImages = await Promise.all(listingImages);

      return [
        ...resultListingCover.map((item) => ({ file: item, priority: 1 })),
        ...resultListingImages.map((item) => ({ file: item, priority: null })),
      ];
    } catch (error) {
      return error;
    }
  }

  public async createScrappedFile(
    createFileDto: CreateFileDto,
  ): Promise<FileEntity> {
    const fileExist = await this.findOne({ path: createFileDto.path });

    if (fileExist) {
      return fileExist;
    }

    return this.fileRepository.save(this.fileRepository.create(createFileDto));
  }

  create(createRowFileDto: CreateRowFileDto): Promise<FileEntity> {
    return this.fileRepository.save(
      this.fileRepository.create(createRowFileDto),
    );
  }

  findOne(fields: EntityCondition<FileEntity>) {
    return this.fileRepository.findOne({
      where: fields,
    });
  }

  findMany(fields: EntityCondition<FileEntity>) {
    return this.fileRepository
      .createQueryBuilder('file')
      .where(fields)
      .getMany();
  }

  delete(fields: EntityCondition<FileEntity>) {
    return this.fileRepository.delete(fields);
  }

  async getPresignedUrls(files: { filename: string; mimetype: string }[]) {
    const s3 = new AWS.S3();
    const presignedUrls = [];

    for (const file of files) {
      const params = {
        Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
        Key: file.filename,
        ContentType: file.mimetype,
        Expires: 60,
      };

      const presignedUrl = await s3.getSignedUrlPromise('putObject', params);
      presignedUrls.push({ filename: file.filename, url: presignedUrl });
    }

    return presignedUrls;
  }
}
