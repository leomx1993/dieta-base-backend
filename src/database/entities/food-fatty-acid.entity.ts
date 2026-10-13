import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Food } from './food.entity';

@Entity('food_fatty_acids')
export class FoodFattyAcid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'food_id', type: 'int', unique: true })
  foodId: number;

  @OneToOne(() => Food, (food) => food.fattyAcids, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'food_id' })
  food: Food;

  @Column({ name: 'taco_id', type: 'int', unique: true })
  tacoId: number;

  @Column({ name: 'saturados_g', type: 'numeric', nullable: true })
  saturadosG: string | null;

  @Column({ name: 'monoinsaturados_g', type: 'numeric', nullable: true })
  monoinsaturadosG: string | null;

  @Column({ name: 'poliinsaturados_g', type: 'numeric', nullable: true })
  poliinsaturadosG: string | null;

  @Column({ name: 'c12_0_g', type: 'numeric', nullable: true })
  c120G: string | null;

  @Column({ name: 'c14_0_g', type: 'numeric', nullable: true })
  c140G: string | null;

  @Column({ name: 'c16_0_g', type: 'numeric', nullable: true })
  c160G: string | null;

  @Column({ name: 'c18_0_g', type: 'numeric', nullable: true })
  c180G: string | null;

  @Column({ name: 'c20_0_g', type: 'numeric', nullable: true })
  c200G: string | null;

  @Column({ name: 'c22_0_g', type: 'numeric', nullable: true })
  c220G: string | null;

  @Column({ name: 'c24_0_g', type: 'numeric', nullable: true })
  c240G: string | null;

  @Column({ name: 'c14_1_g', type: 'numeric', nullable: true })
  c141G: string | null;

  @Column({ name: 'c16_1_g', type: 'numeric', nullable: true })
  c161G: string | null;

  @Column({ name: 'c18_1_g', type: 'numeric', nullable: true })
  c181G: string | null;

  @Column({ name: 'c20_1_g', type: 'numeric', nullable: true })
  c201G: string | null;

  @Column({ name: 'c18_2n6_g', type: 'numeric', nullable: true })
  c182n6G: string | null;

  @Column({ name: 'c18_3n3_g', type: 'numeric', nullable: true })
  c183n3G: string | null;

  @Column({ name: 'c20_4_g', type: 'numeric', nullable: true })
  c204G: string | null;

  @Column({ name: 'c20_5_g', type: 'numeric', nullable: true })
  c205G: string | null;

  @Column({ name: 'c22_5_g', type: 'numeric', nullable: true })
  c225G: string | null;

  @Column({ name: 'c22_6_g', type: 'numeric', nullable: true })
  c226G: string | null;

  @Column({ name: 'c18_1t_g', type: 'numeric', nullable: true })
  c181tG: string | null;

  @Column({ name: 'c18_2t_g', type: 'numeric', nullable: true })
  c182tG: string | null;

  @Column({ name: 'source', type: 'varchar', length: 32, default: 'taco' })
  source: string;

  @Column({ name: 'source_file', type: 'varchar', length: 128 })
  sourceFile: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
