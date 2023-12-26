import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingType } from 'src/listings/entities/listingType.entity';
import { ListingTypeSeedService } from './type-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ListingType])],
  providers: [ListingTypeSeedService],
  exports: [ListingTypeSeedService],
})
export class ListingTypeSeedModule {}
