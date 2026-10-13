import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFoodCatalogTables1700000000000 implements MigrationInterface {
  name = 'CreateFoodCatalogTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "foods" (
        "id" SERIAL NOT NULL,
        "taco_id" integer NOT NULL,
        "description" character varying(128) NOT NULL,
        "umidade_pct" numeric,
        "energia_kcal" numeric,
        "energia_kj" numeric,
        "proteina_g" numeric,
        "lipideos_g" numeric,
        "colesterol_mg" numeric,
        "carboidrato_g" numeric,
        "fibra_g" numeric,
        "cinzas_g" numeric,
        "calcio_mg" numeric,
        "magnesio_mg" numeric,
        "manganes_mg" numeric,
        "fosforo_mg" numeric,
        "ferro_mg" numeric,
        "sodio_mg" numeric,
        "potassio_mg" numeric,
        "cobre_mg" numeric,
        "zinco_mg" numeric,
        "retinol_mcg" numeric,
        "re_mcg" numeric,
        "rae_mcg" numeric,
        "tiamina_mg" numeric,
        "riboflavina_mg" numeric,
        "piridoxina_mg" numeric,
        "niacina_mg" numeric,
        "vitamina_c_mg" numeric,
        "food_base" character varying(64),
        "preparation" character varying(32),
        "qualifiers" character varying(128),
        "category" character varying(64) NOT NULL,
        "nutrient_basis" character varying(16) NOT NULL DEFAULT '100g',
        "source" character varying(32) NOT NULL DEFAULT 'taco',
        "source_file" character varying(128) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_foods_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_foods_taco_id" UNIQUE ("taco_id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_foods_description_lower"
      ON "foods" (lower("description"))
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_foods_category" ON "foods" ("category")
    `);

    await queryRunner.query(`
      CREATE TABLE "food_fatty_acids" (
        "id" SERIAL NOT NULL,
        "food_id" integer NOT NULL,
        "taco_id" integer NOT NULL,
        "saturados_g" numeric,
        "monoinsaturados_g" numeric,
        "poliinsaturados_g" numeric,
        "c12_0_g" numeric,
        "c14_0_g" numeric,
        "c16_0_g" numeric,
        "c18_0_g" numeric,
        "c20_0_g" numeric,
        "c22_0_g" numeric,
        "c24_0_g" numeric,
        "c14_1_g" numeric,
        "c16_1_g" numeric,
        "c18_1_g" numeric,
        "c20_1_g" numeric,
        "c18_2n6_g" numeric,
        "c18_3n3_g" numeric,
        "c20_4_g" numeric,
        "c20_5_g" numeric,
        "c22_5_g" numeric,
        "c22_6_g" numeric,
        "c18_1t_g" numeric,
        "c18_2t_g" numeric,
        "source" character varying(32) NOT NULL DEFAULT 'taco',
        "source_file" character varying(128) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_food_fatty_acids_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_food_fatty_acids_food_id" UNIQUE ("food_id"),
        CONSTRAINT "UQ_food_fatty_acids_taco_id" UNIQUE ("taco_id"),
        CONSTRAINT "FK_food_fatty_acids_food"
          FOREIGN KEY ("food_id") REFERENCES "foods"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "food_amino_acids" (
        "id" SERIAL NOT NULL,
        "food_id" integer NOT NULL,
        "taco_id" integer NOT NULL,
        "triptofano_g" numeric,
        "treonina_g" numeric,
        "isoleucina_g" numeric,
        "leucina_g" numeric,
        "lisina_g" numeric,
        "metionina_g" numeric,
        "cistina_g" numeric,
        "fenilalanina_g" numeric,
        "tirosina_g" numeric,
        "valina_g" numeric,
        "arginina_g" numeric,
        "histidina_g" numeric,
        "alanina_g" numeric,
        "acido_aspartico_g" numeric,
        "acido_glutamico_g" numeric,
        "glicina_g" numeric,
        "prolina_g" numeric,
        "serina_g" numeric,
        "source" character varying(32) NOT NULL DEFAULT 'taco',
        "source_file" character varying(128) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_food_amino_acids_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_food_amino_acids_food_id" UNIQUE ("food_id"),
        CONSTRAINT "UQ_food_amino_acids_taco_id" UNIQUE ("taco_id"),
        CONSTRAINT "FK_food_amino_acids_food"
          FOREIGN KEY ("food_id") REFERENCES "foods"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "food_household_measures" (
        "id" SERIAL NOT NULL,
        "pof_food_code" character varying(16) NOT NULL,
        "food_description" character varying(128) NOT NULL,
        "preparation_code" character varying(16) NOT NULL,
        "preparation_description" character varying(64) NOT NULL,
        "measure_code" character varying(16) NOT NULL,
        "measure_description" character varying(64) NOT NULL,
        "reference_measure_code" character varying(16),
        "reference_measure_description" character varying(64),
        "quantity_g" numeric NOT NULL,
        "source_code" character varying(16),
        "source_description" character varying(160),
        "source" character varying(32) NOT NULL DEFAULT 'pof',
        "source_file" character varying(128) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_food_household_measures_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_food_household_measures_pof_key" UNIQUE (
          "pof_food_code",
          "preparation_code",
          "measure_code"
        )
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_food_household_measures_food_description_lower"
      ON "food_household_measures" (lower("food_description"))
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_food_household_measures_pof_food_code"
      ON "food_household_measures" ("pof_food_code")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "food_household_measures"`);
    await queryRunner.query(`DROP TABLE "food_amino_acids"`);
    await queryRunner.query(`DROP TABLE "food_fatty_acids"`);
    await queryRunner.query(`DROP TABLE "foods"`);
  }
}
