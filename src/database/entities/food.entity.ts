import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FoodAminoAcid } from './food-amino-acid.entity';
import { FoodFattyAcid } from './food-fatty-acid.entity';

@Entity('foods')
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'taco_id', type: 'int', unique: true })
  tacoId: number;

  @Column({ name: 'description', type: 'varchar', length: 128 })
  description: string;

  @Column({ name: 'umidade_pct', type: 'numeric', nullable: true })
  umidadePct: string | null;

  @Column({ name: 'energia_kcal', type: 'numeric', nullable: true })
  energiaKcal: string | null;

  @Column({ name: 'energia_kj', type: 'numeric', nullable: true })
  energiaKj: string | null;

  @Column({ name: 'proteina_g', type: 'numeric', nullable: true })
  proteinaG: string | null;

  @Column({ name: 'lipideos_g', type: 'numeric', nullable: true })
  lipideosG: string | null;

  @Column({ name: 'colesterol_mg', type: 'numeric', nullable: true })
  colesterolMg: string | null;

  @Column({ name: 'carboidrato_g', type: 'numeric', nullable: true })
  carboidratoG: string | null;

  @Column({ name: 'fibra_g', type: 'numeric', nullable: true })
  fibraG: string | null;

  @Column({ name: 'cinzas_g', type: 'numeric', nullable: true })
  cinzasG: string | null;

  @Column({ name: 'calcio_mg', type: 'numeric', nullable: true })
  calcioMg: string | null;

  @Column({ name: 'magnesio_mg', type: 'numeric', nullable: true })
  magnesioMg: string | null;

  @Column({ name: 'manganes_mg', type: 'numeric', nullable: true })
  manganesMg: string | null;

  @Column({ name: 'fosforo_mg', type: 'numeric', nullable: true })
  fosforoMg: string | null;

  @Column({ name: 'ferro_mg', type: 'numeric', nullable: true })
  ferroMg: string | null;

  @Column({ name: 'sodio_mg', type: 'numeric', nullable: true })
  sodioMg: string | null;

  @Column({ name: 'potassio_mg', type: 'numeric', nullable: true })
  potassioMg: string | null;

  @Column({ name: 'cobre_mg', type: 'numeric', nullable: true })
  cobreMg: string | null;

  @Column({ name: 'zinco_mg', type: 'numeric', nullable: true })
  zincoMg: string | null;

  @Column({ name: 'retinol_mcg', type: 'numeric', nullable: true })
  retinolMcg: string | null;

  @Column({ name: 're_mcg', type: 'numeric', nullable: true })
  reMcg: string | null;

  @Column({ name: 'rae_mcg', type: 'numeric', nullable: true })
  raeMcg: string | null;

  @Column({ name: 'tiamina_mg', type: 'numeric', nullable: true })
  tiaminaMg: string | null;

  @Column({ name: 'riboflavina_mg', type: 'numeric', nullable: true })
  riboflavinaMg: string | null;

  @Column({ name: 'piridoxina_mg', type: 'numeric', nullable: true })
  piridoxinaMg: string | null;

  @Column({ name: 'niacina_mg', type: 'numeric', nullable: true })
  niacinaMg: string | null;

  @Column({ name: 'vitamina_c_mg', type: 'numeric', nullable: true })
  vitaminaCMg: string | null;

  @Column({ name: 'food_base', type: 'varchar', length: 64, nullable: true })
  foodBase: string | null;

  @Column({ name: 'preparation', type: 'varchar', length: 32, nullable: true })
  preparation: string | null;

  @Column({ name: 'qualifiers', type: 'varchar', length: 128, nullable: true })
  qualifiers: string | null;

  @Column({ name: 'category', type: 'varchar', length: 64 })
  category: string;

  @Column({ name: 'nutrient_basis', type: 'varchar', length: 16, default: '100g' })
  nutrientBasis: string;

  @Column({ name: 'source', type: 'varchar', length: 32, default: 'taco' })
  source: string;

  @Column({ name: 'source_file', type: 'varchar', length: 128 })
  sourceFile: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => FoodFattyAcid, (row) => row.food)
  fattyAcids: FoodFattyAcid | null;

  @OneToOne(() => FoodAminoAcid, (row) => row.food)
  aminoAcids: FoodAminoAcid | null;
}
