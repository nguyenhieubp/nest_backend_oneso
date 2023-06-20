import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Res,
  Patch,
  Param,
  Get,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ProductDto } from './dto/product.dto';
import { ProductEntity } from './entity/product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('banner', null, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  createProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
    @Body() product: ProductDto,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(files, res, product);
  }

  @Patch('isShow/setShow/:id')
  setIsShowProduct(@Param('id') id: string): Promise<string> {
    return this.productService.setIsShowProduct(id);
  }

  @Patch('isShow/hidden/:id')
  setIsHiddenProduct(@Param('id') id: string): Promise<string> {
    return this.productService.setIsHiddenProduct(id);
  }

  @Patch('/update/:id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  updateAvatar(
    @Param('id') id: string,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.updateAvatar(id, res, file);
  }

  @Get('')
  getAllProduct(@Query() query): Promise<Array<ProductEntity>> {
    return this.productService.getAllProduct(query);
  }

  @Get('hidden/shop/:id')
  getAllProductHidden(
    @Query() query,
    @Param('id') id: string,
  ): Promise<Array<ProductEntity>> {
    return this.productService.getAllProductHidden(query, id);
  }

  @Get('shop/:id')
  getProductShop(
    @Query() query,
    @Param('id') id: string,
  ): Promise<Array<ProductEntity>> {
    return this.productService.getProductShop(query, id);
  }

  @Get('/item/:id')
  getItemProduct(@Param('id') id: string): Promise<ProductEntity> {
    return this.productService.getItemProduct(id);
  }

  @Put('update/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() productUpdate: any,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(id, productUpdate);
  }

  @Get('category/:category')
  getByCategory(
    @Query() query,
    @Param('category') category: string,
  ): Promise<Array<ProductEntity>> {
    return this.productService.getByCategory(query, category);
  }

  @Get('price')
  getProductSortByPrice(@Query() query): Promise<Array<ProductEntity>> {
    return this.productService.getProductSortByPrice(query);
  }

  @Get('search')
  getProductByKeyword(@Query() query): Promise<Array<ProductEntity>> {
    return this.productService.getProductByKeyword(query);
  }
}
