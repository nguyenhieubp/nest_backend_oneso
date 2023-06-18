import { Expose, plainToClass } from 'class-transformer';

export class BaseDto {
  @Expose()
  id: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  static plainToClass<T>(this: new (...args: string[]) => T, obj: T) {
    return plainToClass(this, obj, { excludeExtraneousValues: true });
  }
}
