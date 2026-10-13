import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Food } from '../database/entities/food.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private readonly foods: Repository<Food>,
  ) {}

  search(query?: string, limit = 20): Promise<Food[]> {
    const take = Math.min(Math.max(limit, 1), 100);
    if (!query?.trim()) {
      return this.foods.find({
        order: { description: 'ASC' },
        take,
      });
    }

    return this.foods.find({
      where: { description: ILike(`%${query.trim()}%`) },
      order: { description: 'ASC' },
      take,
    });
  }

  async getById(id: number): Promise<Food> {
    const food = await this.foods.findOne({
      where: { id },
      relations: { fattyAcids: true, aminoAcids: true },
    });
    if (!food) {
      throw new NotFoundException(`Food ${id} not found`);
    }
    return food;
  }
}
