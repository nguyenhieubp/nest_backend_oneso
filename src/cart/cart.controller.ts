import { Controller, Post, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from './dto/cart.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  createCart(@Body() cartData: CartDto) {
    const cart = CartDto.plainToClass(cartData);
    return this.cartService.createCart(cart);
  }
}
