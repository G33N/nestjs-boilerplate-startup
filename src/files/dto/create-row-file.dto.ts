import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRowFileDto {
  @ApiProperty({ example: 'uuid' })
  @IsOptional()
  id: string | null;

  @ApiProperty({ example: 'http://images.com' })
  @IsNotEmpty()
  path: string | null;

  @ApiProperty({ example: 'manual' })
  @IsOptional()
  source: string | null;

  @ApiProperty({ example: 'ChIJL93crAo1o5URuMwGxIx37tw' })
  @IsOptional()
  sourceId: string | null;
}
