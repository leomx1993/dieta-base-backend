import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('food_household_measures')
export class FoodHouseholdMeasure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pof_food_code', type: 'varchar', length: 16 })
  pofFoodCode: string;

  @Column({ name: 'food_description', type: 'varchar', length: 128 })
  foodDescription: string;

  @Column({ name: 'preparation_code', type: 'varchar', length: 16 })
  preparationCode: string;

  @Column({ name: 'preparation_description', type: 'varchar', length: 64 })
  preparationDescription: string;

  @Column({ name: 'measure_code', type: 'varchar', length: 16 })
  measureCode: string;

  @Column({ name: 'measure_description', type: 'varchar', length: 64 })
  measureDescription: string;

  @Column({ name: 'reference_measure_code', type: 'varchar', length: 16, nullable: true })
  referenceMeasureCode: string | null;

  @Column({
    name: 'reference_measure_description',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  referenceMeasureDescription: string | null;

  @Column({ name: 'quantity_g', type: 'numeric' })
  quantityG: string;

  @Column({ name: 'source_code', type: 'varchar', length: 16, nullable: true })
  sourceCode: string | null;

  @Column({ name: 'source_description', type: 'varchar', length: 160, nullable: true })
  sourceDescription: string | null;

  @Column({ name: 'source', type: 'varchar', length: 32, default: 'pof' })
  source: string;

  @Column({ name: 'source_file', type: 'varchar', length: 128 })
  sourceFile: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
