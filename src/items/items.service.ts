import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(@InjectRepository(Item) private repo: Repository<Item>) {}

  async create(dto: CreateItemDto) {
    const item = this.repo.create(dto as any);
    return this.repo.save(item);
  }

  async findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async update(id: string, dto: UpdateItemDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto as any);
    return this.repo.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    return this.repo.remove(item);
  }
}
