import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ default: new Date() })
  create_at: Date;

  @UpdateDateColumn({ default: new Date() })
  update_at: Date;
}
