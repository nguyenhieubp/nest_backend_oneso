import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() data: any) {
    const images = data.banner;
    console.log(typeof images);
  }
}
