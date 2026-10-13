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

@Entity('food_amino_acids')
export class FoodAminoAcid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'food_id', type: 'int', unique: true })
  foodId: number;

  @OneToOne(() => Food, (food) => food.aminoAcids, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'food_id' })
  food: Food;

  @Column({ name: 'taco_id', type: 'int', unique: true })
  tacoId: number;

  @Column({ name: 'triptofano_g', type: 'numeric', nullable: true })
  triptofanoG: string | null;

  @Column({ name: 'treonina_g', type: 'numeric', nullable: true })
  treoninaG: string | null;

  @Column({ name: 'isoleucina_g', type: 'numeric', nullable: true })
  isoleucinaG: string | null;

  @Column({ name: 'leucina_g', type: 'numeric', nullable: true })
  leucinaG: string | null;

  @Column({ name: 'lisina_g', type: 'numeric', nullable: true })
  lisinaG: string | null;

  @Column({ name: 'metionina_g', type: 'numeric', nullable: true })
  metioninaG: string | null;

  @Column({ name: 'cistina_g', type: 'numeric', nullable: true })
  cistinaG: string | null;

  @Column({ name: 'fenilalanina_g', type: 'numeric', nullable: true })
  fenilalaninaG: string | null;

  @Column({ name: 'tirosina_g', type: 'numeric', nullable: true })
  tirosinaG: string | null;

  @Column({ name: 'valina_g', type: 'numeric', nullable: true })
  valinaG: string | null;

  @Column({ name: 'arginina_g', type: 'numeric', nullable: true })
  argininaG: string | null;

  @Column({ name: 'histidina_g', type: 'numeric', nullable: true })
  histidinaG: string | null;

  @Column({ name: 'alanina_g', type: 'numeric', nullable: true })
  alaninaG: string | null;

  @Column({ name: 'acido_aspartico_g', type: 'numeric', nullable: true })
  acidoAsparticoG: string | null;

  @Column({ name: 'acido_glutamico_g', type: 'numeric', nullable: true })
  acidoGlutamicoG: string | null;

  @Column({ name: 'glicina_g', type: 'numeric', nullable: true })
  glicinaG: string | null;

  @Column({ name: 'prolina_g', type: 'numeric', nullable: true })
  prolinaG: string | null;

  @Column({ name: 'serina_g', type: 'numeric', nullable: true })
  serinaG: string | null;

  @Column({ name: 'source', type: 'varchar', length: 32, default: 'taco' })
  source: string;

  @Column({ name: 'source_file', type: 'varchar', length: 128 })
  sourceFile: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
