import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18n, I18nService } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';
import { Booking } from 'src/bookings/entities/bookings.entity';
import { ListingsService } from 'src/listings/listings.service';

@Injectable()
export class MailService {
  constructor(
    @I18n()
    private i18n: I18nService,
    private mailerService: MailerService,
    private configService: ConfigService,
    private listingService: ListingsService,
  ) {}

  async userSignUp(mailData: MailData<{ hash: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: await this.i18n.t('common.confirmEmail'),
      text: `${this.configService.get('app.frontendDomain')}/confirm-email/${
        mailData.data.hash
      } ${await this.i18n.t('common.confirmEmail')}`,
      template: 'activation',
      context: {
        title: await this.i18n.t('common.confirmEmail'),
        url: `${this.configService.get('app.frontendDomain')}/confirm-email/${
          mailData.data.hash
        }`,
        actionTitle: await this.i18n.t('common.confirmEmail'),
        app_name: this.configService.get('app.name'),
        text1: await this.i18n.t('confirm-email.text1'),
        text2: await this.i18n.t('confirm-email.text2'),
        text3: await this.i18n.t('confirm-email.text3'),
      },
    });
  }

  async forgotPassword(mailData: MailData<{ hash: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: await this.i18n.t('common.resetPassword'),
      text: `${this.configService.get('app.frontendDomain')}/password-change/${
        mailData.data.hash
      } ${await this.i18n.t('common.resetPassword')}`,
      template: 'reset-password',
      context: {
        title: await this.i18n.t('common.resetPassword'),
        url: `${this.configService.get(
          'app.frontendDomain',
        )}/auth/change-password/?hash=${mailData.data.hash}`,
        actionTitle: await this.i18n.t('common.resetPassword'),
        app_name: this.configService.get('app.name'),
        text1: await this.i18n.t('reset-password.text1'),
        text2: await this.i18n.t('reset-password.text2'),
        text3: await this.i18n.t('reset-password.text3'),
        text4: await this.i18n.t('reset-password.text4'),
      },
    });
  }

  async userWelcome(
    mailData: MailData<{
      hash: string;
      name: string;
    }>,
  ) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: await this.i18n.t('common.welcome'),
      text: `${this.configService.get('app.frontendDomain')}/confirm-email/${
        mailData.data.hash
      } ${await this.i18n.t('common.confirmEmail')}`,
      template: 'welcome',
      context: {
        name: mailData.data.name,
        url: `${this.configService.get('app.frontendDomain')}/confirm-email/${
          mailData.data.hash
        }`,
        actionTitle: await this.i18n.t('common.confirmEmail'),
        app_name: this.configService.get('app.name'),
        text1: await this.i18n.t('confirm-email.text1'),
        text2: await this.i18n.t('confirm-email.text2'),
        text3: await this.i18n.t('confirm-email.text3'),
      },
    });
  }

  async userBooking(
    mailData: MailData<{
      name: string;
      booking: Booking;
    }>,
  ) {
    const listing = await this.listingService.findOne({
      id: mailData.data.booking.listingId,
    });
    const address = `${listing.address.city}, ${listing.address.streetName} ${listing.address.streetNumber}`;
    const imageUrl = listing.images[0]?.file ?? { path: '' };
    const date = `${new Date(
      mailData.data.booking.startDate,
    ).toLocaleDateString('es-ES')}`;
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: await this.i18n.t('common.bookingSubject'),
      text: `${this.configService.get(
        'app.frontendDomain',
      )}/confirm-email ${await this.i18n.t('common.confirmEmail')}`,
      template: 'booking',
      context: {
        name: mailData.data.name,
        spaceTitle: listing.title,
        spaceLocation: address,
        date: date,
        imageUrl: imageUrl,
        listing: listing,
        payment: mailData.data.booking.price
          ? ` $${(mailData.data.booking.price * 1.12).toLocaleString('es-ES')}`
          : 'to be confirmed',
        host: listing.user.firstName,
        url: `${this.configService.get('app.frontendDomain')}/confirm-email/`,
        actionTitle: await this.i18n.t('common.confirmEmail'),
        app_name: this.configService.get('app.name'),
        text1: await this.i18n.t('confirm-email.text1'),
        text2: await this.i18n.t('confirm-email.text2'),
        text3: await this.i18n.t('confirm-email.text3'),
      },
    });
  }

  async acceptBooking(
    mailData: MailData<{
      name: string;
      booking: Booking;
      paymentlink: string;
    }>,
  ) {
    const listing = await this.listingService.findOne({
      id: mailData.data.booking.listingId,
    });
    const address = `${listing.address.city}, ${listing.address.streetName} ${listing.address.streetNumber}`;
    const imageUrl = listing.images[0].file;
    const startDate = `${new Date(
      mailData.data.booking.startDate,
    ).toLocaleDateString('es-ES')}`;
    const endDate = `${new Date(
      mailData.data.booking.endDate,
    ).toLocaleDateString('es-ES')}`;
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: await this.i18n.t('accept-booking-email.subject'),
      text: `${this.configService.get(
        'app.frontendDomain',
      )}/confirm-email ${await this.i18n.t('common.confirmEmail')}`,
      template: 'accepted-booking',
      context: {
        name: mailData.data.name,
        spaceTitle: listing.title,
        spaceLocation: address,
        date: startDate,
        endDate: endDate,
        imageUrl: imageUrl,
        listing: listing,
        payment: mailData.data.booking.price
          ? ` $${(mailData.data.booking.price * 1.12).toLocaleString('es-ES')}`
          : 'to be confirmed',
        guests: mailData.data.booking.guests,
        url: `${this.configService.get('app.frontendDomain')}/confirm-email/`,
        actionTitle: await this.i18n.t('common.confirmEmail'),
        app_name: this.configService.get('app.name'),
        text1: await this.i18n.t('confirm-email.text1'),
        text2: await this.i18n.t('confirm-email.text2'),
        text3: await this.i18n.t('confirm-email.text3'),
        paymentLink: mailData.data.paymentlink,
      },
    });
  }

  async rejectBooking(
    mailData: MailData<{
      name: string;
      booking: Booking;
    }>,
  ) {
    const listing = await this.listingService.findOne({
      id: mailData.data.booking.listingId,
    });
    const address = `${listing.address.city}, ${listing.address.streetName} ${listing.address.streetNumber}`;
    const imageUrl = listing.images[0].file;
    const startDate = `${new Date(
      mailData.data.booking.startDate,
    ).toLocaleDateString('es-ES')}`;
    const endDate = `${new Date(mailData.data.booking.endDate).toDateString()}`;
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: await this.i18n.t('reject-booking-email.subject'),
      text: `${this.configService.get(
        'app.frontendDomain',
      )}/confirm-email ${await this.i18n.t('common.confirmEmail')}`,
      template: 'rejected-booking',
      context: {
        name: mailData.data.name,
        spaceTitle: listing.title,
        spaceLocation: address,
        date: startDate,
        endDate: endDate,
        imageUrl: imageUrl,
        listing: listing,
        payment: mailData.data.booking.price
          ? ` $${(mailData.data.booking.price * 1.12).toLocaleString('es-ES')}`
          : 'to be confirmed',
        guests: mailData.data.booking.guests,
        url: `${this.configService.get('app.frontendDomain')}/confirm-email/`,
        actionTitle: await this.i18n.t('common.confirmEmail'),
        app_name: this.configService.get('app.name'),
        text1: await this.i18n.t('confirm-email.text1'),
        text2: await this.i18n.t('confirm-email.text2'),
        text3: await this.i18n.t('confirm-email.text3'),
      },
    });
  }

  async confirmBooking(
    mailData: MailData<{
      name: string;
      booking: Booking;
      guestName: string;
      guestImage: string;
    }>,
  ) {
    const listing = await this.listingService.findOne({
      id: mailData.data.booking.listingId,
    });
    const address = `${listing.address.city}, ${listing.address.streetName} ${listing.address.streetNumber}`;
    const imageUrl = listing.images[0]?.file ?? { path: '' };
    const startDate = `${new Date(
      mailData.data.booking.startDate,
    ).toLocaleDateString('es-ES')}`;
    const endDate = `${new Date(mailData.data.booking.endDate).toDateString()}`;
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: await this.i18n.t('confirm-booking-email.subject'),
      text: `${this.configService.get(
        'app.frontendDomain',
      )}/confirm-email ${await this.i18n.t('common.confirmEmail')}`,
      template: 'confirm-booking',
      context: {
        name: mailData.data.name,
        spaceTitle: listing.title,
        spaceLocation: address,
        guest: mailData.data.guestName,
        date: startDate,
        endDate: endDate,
        imageUrl: imageUrl,
        listing: listing,
        payment: mailData.data.booking.price
          ? ` $${mailData.data.booking.price.toLocaleString('es-ES')}`
          : 'to be confirmed',
        guests: mailData.data.booking.guests,
        url: `${this.configService.get('app.frontendDomain')}/confirm-email/`,
        actionTitle: await this.i18n.t('common.confirmEmail'),
        app_name: this.configService.get('app.name'),
        text1: await this.i18n.t('confirm-email.text1'),
        text2: await this.i18n.t('confirm-email.text2'),
        text3: await this.i18n.t('confirm-email.text3'),
        id: mailData.data.booking.id,
        image: mailData.data.guestImage
          ? mailData.data.guestImage
          : 'https://spacepal-email-assets-prd.s3.amazonaws.com/default-icon.png',
      },
    });
  }

  async succesPaymentGuest(
    mailData: MailData<{
      booking: Booking;
    }>,
  ) {
    const listing = await this.listingService.findOne({
      id: mailData.data.booking.listingId,
    });
    const address = `${listing.address.city}, ${listing.address.streetName} ${listing.address.streetNumber}`;
    const imageUrl = listing.images[0]?.file ?? { path: '' };
    const startDate = `${new Date(
      mailData.data.booking.startDate,
    ).toLocaleDateString('es-ES')}`;
    const endDate = `${new Date(
      mailData.data.booking.endDate,
    ).toLocaleDateString('es-ES')}`;
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: await this.i18n.t('guest-success-payment-email.subject'),
      text: `${this.configService.get(
        'app.frontendDomain',
      )}/confirm-email ${await this.i18n.t('common.confirmEmail')}`,
      template: 'guest-success-payment',
      context: {
        name: listing.user.firstName,
        spaceTitle: listing.title,
        spaceLocation: address,
        guest: mailData.data.booking.user.firstName,
        date: startDate,
        endDate: endDate,
        imageUrl: imageUrl,
        listing: listing,
        payment: mailData.data.booking.price
          ? ` $${mailData.data.booking.price.toLocaleString('es-ES')}`
          : 'to be confirmed',
        guests: mailData.data.booking.guests,
        url: `${this.configService.get('app.frontendDomain')}/confirm-email/`,
        actionTitle: await this.i18n.t('common.confirmEmail'),
        app_name: this.configService.get('app.name'),
        text1: await this.i18n.t('confirm-email.text1'),
        text2: await this.i18n.t('confirm-email.text2'),
        text3: await this.i18n.t('confirm-email.text3'),
      },
    });
  }

  async successPaymentHost(
    mailData: MailData<{
      booking: Booking;
    }>,
  ) {
    const listing = await this.listingService.findOne({
      id: mailData.data.booking.listingId,
    });
    const address = `${listing.address.city}, ${listing.address.streetName} ${listing.address.streetNumber}`;
    const imageUrl = listing.images[0]?.file ?? { path: '' };
    const startDate = `${new Date(
      mailData.data.booking.startDate,
    ).toLocaleDateString('es-ES')}`;
    const endDate = `${new Date(
      mailData.data.booking.endDate,
    ).toLocaleDateString('es-ES')}`;
    await this.mailerService.sendMail({
      to: listing.user.email,
      subject: await this.i18n.t('host-success-payment-email.subject'),
      text: `${this.configService.get(
        'app.frontendDomain',
      )}/confirm-email ${await this.i18n.t('common.confirmEmail')}`,
      template: 'host-success-payment',
      context: {
        name: listing.user.firstName,
        spaceTitle: listing.title,
        spaceLocation: address,
        guest: mailData.data.booking.user.firstName,
        image: mailData.data.booking.user.photo
          ? mailData.data.booking.user.photo.path
          : 'https://spacepal-email-assets-prd.s3.amazonaws.com/default-icon.png',
        date: startDate,
        endDate: endDate,
        imageUrl: imageUrl,
        listing: listing,
        payment: mailData.data.booking.price
          ? ` $${mailData.data.booking.price.toLocaleString('es-ES')}`
          : 'to be confirmed',
        guests: mailData.data.booking.guests,
        url: `${this.configService.get('app.frontendDomain')}/confirm-email/`,
        actionTitle: await this.i18n.t('common.confirmEmail'),
        app_name: this.configService.get('app.name'),
        text1: await this.i18n.t('confirm-email.text1'),
        text2: await this.i18n.t('confirm-email.text2'),
        text3: await this.i18n.t('confirm-email.text3'),
      },
    });
  }
}
