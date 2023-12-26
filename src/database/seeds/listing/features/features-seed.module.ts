import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingFeatures } from 'src/listings/entities/listingFeatures.entity';
import { ListingFeaturesSeedService } from './features-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ListingFeatures])],
  providers: [ListingFeaturesSeedService],
  exports: [ListingFeaturesSeedService],
})
export class ListingFeaturesSeedModule {}
