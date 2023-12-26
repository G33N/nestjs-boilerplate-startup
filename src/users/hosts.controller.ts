import { Controller, Get, Param, HttpStatus, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';

import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';

@Roles(RoleEnum.admin, RoleEnum.user)
@ApiTags('Hosts')
@Controller({
  path: 'hosts',
  version: '1',
})
export class HostController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id });
  }
}
