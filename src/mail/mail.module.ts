import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { ListingsModule } from 'src/listings/listings.module';

@Module({
  imports: [ConfigModule, ListingsModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
