import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ProductDto } from './dto/product.dto';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  public async priceProduct(price: number, quantity: number) {
    return price * quantity;
  }

  public async createProduct(
    files: Express.Multer.File[],
    res: Response,
    product: ProductDto,
  ): Promise<ProductEntity | any> {
    const fileNames = files.map((file) => file.filename);
    const imagePaths = fileNames.map((fileName) =>
      path.join(__dirname, '../../uploads', fileName),
    );

    const productReal = ProductDto.plainToClass({
      banner_products: imagePaths,
      ...product,
    });

    await this.productRepository.save(productReal);
    res.json(productReal);
  }

  public async setIsShowProduct(id: string): Promise<string> {
    await this.productRepository.update(id, { isShow: true });
    return 'set show success';
  }

  public async setIsHiddenProduct(id: string): Promise<string> {
    await this.productRepository.update(id, { isShow: false });
    return 'set hidden success';
  }

  public async getAllProduct(query): Promise<Array<ProductEntity>> {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;

    return await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.shop', 'shop')
      .where('products.isShow = true')
      .take(take)
      .skip(skip)
      .getMany();
  }

  public async getAllProductHidden(
    query,
    id: string,
  ): Promise<Array<ProductEntity>> {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    return await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.shop', 'shop')
      .where('products.isShow = false AND shop.id =:id', { id })
      .take(take)
      .skip(skip)
      .getMany();
  }

  public async getProductShop(
    query,
    id: string,
  ): Promise<Array<ProductEntity>> {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    return await this.productRepository
      .createQueryBuilder('products')
      .where('products.shop =:shopId', { shopId: id })
      .take(take)
      .skip(skip)
      .getMany();
  }

  public async getItemProduct(id: string): Promise<ProductEntity> {
    return await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.shop', 'shop')
      .where('products.id =:id', { id: id })
      .getOne();
  }

  public async updateAvatar(
    id: string,
    res: Response,
    file: Express.Multer.File,
  ): Promise<any> {
    const imagePath = path.join(__dirname, '../../uploads', file.filename);
    await this.productRepository.update(id, { avatar_product: imagePath });
    res.sendFile(imagePath);
  }

  public async updateProduct(
    id: string,
    productUpdate: any,
  ): Promise<ProductEntity> {
    await this.productRepository.update(id, productUpdate);
    return await this.productRepository.findOneById(id);
  }

  public async getByCategory(
    query,
    category: string,
  ): Promise<Array<ProductEntity>> {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    return await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.shop', 'shop')
      .where('products.category =:category', { category })
      .take(take)
      .skip(skip)
      .getMany();
  }

  public async getProductSortByPrice(query): Promise<Array<ProductEntity>> {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    return await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.shop', 'shop')
      .take(take)
      .skip(skip)
      .orderBy('products.price_online', query.sort)
      .getMany();
  }

  public async getProductByKeyword(query): Promise<Array<ProductEntity>> {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    return await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.shop', 'shop')
      .where('products.name_product LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      })
      .take(take)
      .skip(skip)
      .getMany();
  }
}
