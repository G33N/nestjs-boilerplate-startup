import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListingType } from 'src/listings/entities/listingType.entity';
import { ListingTypeEnum } from 'src/listings/listingType.enum';
import { Repository } from 'typeorm';

@Injectable()
export class ListingTypeSeedService {
  constructor(
    @InjectRepository(ListingType)
    private repository: Repository<ListingType>,
  ) {}

  async run() {
    const countHotDesk = await this.repository.count({
      where: {
        id: ListingTypeEnum.HOT_DESK,
      },
    });

    if (countHotDesk === 0) {
      await this.repository.save(
        this.repository.create({
          id: ListingTypeEnum.HOT_DESK,
          name: 'HOT_DESK',
        }),
      );
    }

    const countDedicatedDesk = await this.repository.count({
      where: {
        id: ListingTypeEnum.DEDICATED_DESK,
      },
    });

    if (countDedicatedDesk === 0) {
      await this.repository.save(
        this.repository.create({
          id: ListingTypeEnum.DEDICATED_DESK,
          name: 'DEDICATED_DESK',
        }),
      );
    }

    const countPrivateOffice = await this.repository.count({
      where: {
        id: ListingTypeEnum.PRIVATE_OFFICE,
      },
    });

    if (countPrivateOffice === 0) {
      await this.repository.save(
        this.repository.create({
          id: ListingTypeEnum.PRIVATE_OFFICE,
          name: 'PRIVATE_OFFICE',
        }),
      );
    }

    const countMeetingRoom = await this.repository.count({
      where: {
        id: ListingTypeEnum.MEETING_ROOM,
      },
    });

    if (countMeetingRoom === 0) {
      await this.repository.save(
        this.repository.create({
          id: ListingTypeEnum.MEETING_ROOM,
          name: 'MEETING_ROOM',
        }),
      );
    }

    const countConferenceRoom = await this.repository.count({
      where: {
        id: ListingTypeEnum.CONFERENCE_ROOM,
      },
    });

    if (countConferenceRoom === 0) {
      await this.repository.save(
        this.repository.create({
          id: ListingTypeEnum.CONFERENCE_ROOM,
          name: 'CONFERENCE_ROOM',
        }),
      );
    }

    const countTrainingRoom = await this.repository.count({
      where: {
        id: ListingTypeEnum.TRAINING_ROOM,
      },
    });

    if (countTrainingRoom === 0) {
      await this.repository.save(
        this.repository.create({
          id: ListingTypeEnum.TRAINING_ROOM,
          name: 'TRAINING_ROOM',
        }),
      );
    }

    const countEventVenue = await this.repository.count({
      where: {
        id: ListingTypeEnum.EVENT_VENUE,
      },
    });

    if (countEventVenue === 0) {
      await this.repository.save(
        this.repository.create({
          id: ListingTypeEnum.EVENT_VENUE,
          name: 'EVENT_VENUE',
        }),
      );
    }

    const countWarehouse = await this.repository.count({
      where: {
        id: ListingTypeEnum.WAREHOUSE,
      },
    });

    if (countWarehouse === 0) {
      await this.repository.save(
        this.repository.create({
          id: ListingTypeEnum.WAREHOUSE,
          name: 'WAREHOUSE',
        }),
      );
    }

    const countCreativeStudio = await this.repository.count({
      where: {
        id: ListingTypeEnum.CREATIVE_STUDIO,
      },
    });

    if (countCreativeStudio === 0) {
      await this.repository.save(
        this.repository.create({
          id: ListingTypeEnum.CREATIVE_STUDIO,
          name: 'CREATIVE_STUDIO',
        }),
      );
    }

    const countHealthAndWellness = await this.repository.count({
      where: {
        id: ListingTypeEnum.HEALTH_WELLNESS,
      },
    });

    if (countHealthAndWellness === 0) {
      await this.repository.save(
        this.repository.create({
          id: ListingTypeEnum.HEALTH_WELLNESS,
          name: 'HEALTH_WELLNESS',
        }),
      );
    }

    const countBeauty = await this.repository.count({
      where: {
        id: ListingTypeEnum.BEAUTY,
      },
    });

    if (countBeauty === 0) {
      await this.repository.save(
        this.repository.create({
          id: ListingTypeEnum.BEAUTY,
          name: 'BEAUTY',
        }),
      );
    }
  }
}
