import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';

@Controller('health')
export class HealthController {
  private logger = new Logger(HealthController.name);

  @Get()
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return { name: `${process.env.NODE_ENV} API Server` };
  }
}
