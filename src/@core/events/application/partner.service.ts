import { UnitOfWork } from 'src/@core/common/application/unit-of-work';
import { Partner, PartnerId } from '../domain/entities/partner.entity';
import { PartnerRepository } from '../domain/repositories/partner.repository';

export class PartnerService {
  constructor(
    private partnerRepository: PartnerRepository,
    private uow: UnitOfWork,
  ) {}

  list() {
    return this.partnerRepository.findAll();
  }

  async register(input: { name: string }) {
    const partner = Partner.create(input);
    await this.partnerRepository.add(partner);
    await this.uow.commit();
    return partner;
  }

  async update(id: string, input: { name?: string }) {
    const partner = await this.partnerRepository.findById(new PartnerId(id));
    if (!partner) {
      throw new Error('Partner not found');
    }
    input.name && partner.changeName(input.name);
    await this.partnerRepository.add(partner);
    await this.uow.commit();
    return partner;
  }
}
