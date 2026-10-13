import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FoodService } from './food.service';

@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  search(
    @Query('q') query?: string,
    @Query('limit') limit?: string,
  ) {
    return this.foodService.search(query, limit ? Number(limit) : 20);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.foodService.getById(id);
  }
}
