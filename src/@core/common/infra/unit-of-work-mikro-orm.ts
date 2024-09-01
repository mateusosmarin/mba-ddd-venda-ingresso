import { EntityManager } from '@mikro-orm/core';
import { UnitOfWork } from '../application/unit-of-work';
import { AggregateRoot } from '../domain/aggregate-root';

export class UnitOfWorkMikroORM implements UnitOfWork {
  constructor(private em: EntityManager) {}

  beginTransaction() {
    return this.em.begin();
  }
  completeTransaction() {
    return this.em.commit();
  }
  rollbackTransaction() {
    return this.em.rollback();
  }

  runTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.em.transactional(callback);
  }

  commit() {
    return this.em.flush();
  }

  async rollback() {
    this.em.clear();
  }

  getAggregateRoots(): AggregateRoot[] {
    return [
      ...this.em.getUnitOfWork().getPersistStack(),
      ...this.em.getUnitOfWork().getRemoveStack(),
    ] as AggregateRoot[];
  }
}
