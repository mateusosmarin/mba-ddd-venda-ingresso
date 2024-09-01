import { DomainEventManager } from '../domain/domain-event-manager';
import { UnitOfWork } from './unit-of-work';

export class ApplicationService {
  constructor(
    private uow: UnitOfWork,
    private domainEventManager: DomainEventManager,
  ) {}

  async start() {}

  async finish() {
    const aggregateRoots = this.uow.getAggregateRoots();
    for (const aggregateRoot of aggregateRoots) {
      await this.domainEventManager.publish(aggregateRoot);
    }
    await this.uow.commit();
  }

  async fail() {}

  async run<T>(callback: () => Promise<T>): Promise<T> {
    try {
      await this.start();
      const result = await callback();
      await this.finish();
      return result;
    } catch (e) {
      await this.fail();
      throw e;
    }
  }
}
