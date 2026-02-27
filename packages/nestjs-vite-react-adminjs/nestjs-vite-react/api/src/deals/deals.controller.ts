import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DealsService } from './deals.service';

@Controller('api/deals')
export class DealsController {
  constructor(private readonly deals: DealsService) {}

  @Get()
  list() {
    return this.deals.findAll();
  }

  @Post()
  create(@Body() body: { name: string; description: string; address: string }) {
    return this.deals.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.deals.update(id, body as { name?: string; description?: string; address?: string; status?: string });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deals.remove(id);
  }
}
