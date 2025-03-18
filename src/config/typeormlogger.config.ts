import { Logger } from '@nestjs/common';
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';

export class TypeOrmCustomLogger implements TypeOrmLogger {
  private readonly logger = new Logger('TypeORM');

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.debug(
      `Query: ${query} -- Parameters: ${JSON.stringify(parameters)}`,
    );
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.error(
      `Query Failed: ${query} -- Parameters: ${JSON.stringify(parameters)} -- Error: ${error}`,
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.warn(
      `Slow Query (${time}ms): ${query} -- Parameters: ${JSON.stringify(parameters)}`,
    );
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.debug(`Schema Build: ${message}`);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.debug(`Migration: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    if (level === 'log') {
      this.logger.debug(message);
    } else if (level === 'info') {
      this.logger.debug(message);
    } else if (level === 'warn') {
      this.logger.warn(message);
    }
  }
}
