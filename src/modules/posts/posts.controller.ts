import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(@Query('status') status?: string) {
    return this.postsService.findAll(status);
  }
}
