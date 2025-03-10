import { EntityManager } from '@mikro-orm/mysql';
import {
  Partner,
  PartnerId,
} from 'src/@core/events/domain/entities/partner.entity';
import { PartnerRepository } from 'src/@core/events/domain/repositories/partner.repository';

export class PartnerMySqlRepository implements PartnerRepository {
  constructor(private entityManager: EntityManager) {}

  async add(entity: Partner): Promise<void> {
    this.entityManager.persist(entity);
  }

  async findById(id: PartnerId): Promise<Partner | null> {
    return this.entityManager.findOne(Partner, {
      id: id instanceof PartnerId ? id : new PartnerId(id),
    });
  }

  async findAll(): Promise<Partner[]> {
    return this.entityManager.find(Partner, {});
  }

  async delete(entity: Partner): Promise<void> {
    this.entityManager.remove(entity);
  }
}
