import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { CartItemService } from './cart_item.service';
import { CartItemDto } from './dto/cart_item.dto';
import { CartItemEntity } from './entity/cart_item.entity';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post()
  createCartItem(@Body() cartItemData: CartItemDto): Promise<CartItemEntity> {
    const cartItem = CartItemDto.plainToClass(cartItemData);
    return this.cartItemService.createCartItem(cartItem);
  }

  @Get('/cart/:id')
  getByCart(@Param('id') id: string): Promise<Array<CartItemEntity>> {
    return this.cartItemService.getByCart(id);
  }

  @Delete(':id')
  deleteCartItem(@Param('id') id: string): Promise<string> {
    return this.cartItemService.deleteCartItem(id);
  }

  @Get('item/:id')
  getCartItem(@Param('id') id: string): Promise<CartItemEntity> {
    return this.cartItemService.getCartItem(id);
  }

  @Patch('quantity/up/:id')
  updateQuantityUp(@Param('id') id: string) {
    return this.cartItemService.updateQuantityUp(id);
  }

  @Patch('quantity/down/:id')
  updateQuantityDown(@Param('id') id: string) {
    return this.cartItemService.updateQuantityDown(id);
  }
}
