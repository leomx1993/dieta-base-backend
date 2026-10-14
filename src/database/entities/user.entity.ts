import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '@types';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', type: 'varchar' })
  email: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'surname', type: 'varchar', nullable: true })
  surname: string | null;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    enumName: 'users_role_enum',
  })
  role: UserRole;

  @Column({ name: 'cognito_id', type: 'varchar', nullable: true })
  cognitoId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
