import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api-users')
export class UsersController {
  constructor(private UsersService: UsersService) {}
}
