import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return this.admin.login(body.username, body.password);
  }
}
