import { EntityManager } from '@mikro-orm/core';
import { UnitOfWork } from '../application/unit-of-work';

export class UnitOfWorkMikroORM implements UnitOfWork {
  constructor(private em: EntityManager) {}

  async commit() {
    return this.em.flush();
  }

  async rollback() {
    this.em.clear();
  }
}
