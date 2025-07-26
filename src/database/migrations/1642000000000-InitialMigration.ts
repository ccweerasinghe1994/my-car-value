import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1642000000000 implements MigrationInterface {
  name = 'InitialMigration1642000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" varchar PRIMARY KEY NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "deletedAt" datetime,
        "email" varchar(255) NOT NULL,
        "firstName" varchar(100) NOT NULL,
        "lastName" varchar(100) NOT NULL,
        "password" varchar(255) NOT NULL,
        "isEmailVerified" boolean NOT NULL DEFAULT (0),
        "phoneNumber" varchar(50),
        "dateOfBirth" date,
        CONSTRAINT "UQ_user_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_user_email" ON "users" ("email")
    `);

    await queryRunner.query(`
      CREATE TABLE "reports" (
        "id" varchar PRIMARY KEY NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "deletedAt" datetime,
        "make" varchar(100) NOT NULL,
        "model" varchar(100) NOT NULL,
        "year" integer NOT NULL,
        "mileage" integer NOT NULL,
        "price" decimal(10,2) NOT NULL,
        "longitude" real,
        "latitude" real,
        "description" varchar(255),
        "isApproved" boolean NOT NULL DEFAULT (0),
        "userId" varchar NOT NULL,
        CONSTRAINT "FK_report_user" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_report_year" ON "reports" ("year")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_report_userId" ON "reports" ("userId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_report_userId"`);
    await queryRunner.query(`DROP INDEX "IDX_report_year"`);
    await queryRunner.query(`DROP TABLE "reports"`);
    await queryRunner.query(`DROP INDEX "IDX_user_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
