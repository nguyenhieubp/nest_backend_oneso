import { Controller } from '@nestjs/common';
import { CartItemService } from './cart_item.service';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}
}
