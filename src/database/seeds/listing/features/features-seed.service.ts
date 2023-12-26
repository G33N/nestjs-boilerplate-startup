import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListingFeatures } from 'src/listings/entities/listingFeatures.entity';
import { ListingFeaturesEnum } from 'src/listings/listingFeatures.enum';
import { Repository } from 'typeorm';

@Injectable()
export class ListingFeaturesSeedService {
  constructor(
    @InjectRepository(ListingFeatures)
    private repository: Repository<ListingFeatures>,
  ) {}

  async run() {
    for (const feature in ListingFeaturesEnum) {
      if (typeof ListingFeaturesEnum[feature] === 'number') {
        const count = await this.repository.count({
          where: {
            id: parseInt(ListingFeaturesEnum[feature]),
          },
        });
        if (count === 0) {
          await this.repository.save(
            this.repository.create({
              id: parseInt(ListingFeaturesEnum[feature]),
              name: feature,
            }),
          );
        }
      }
    }
  }
}
