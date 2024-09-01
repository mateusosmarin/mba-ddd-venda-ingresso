import { Partner, PartnerId } from '../domain/entities/partner.entity';
import { PartnerRepository } from '../domain/repositories/partner.repository';
import { ApplicationService } from 'src/@core/common/application/application.service';

export class PartnerService {
  constructor(
    private partnerRepository: PartnerRepository,
    private applicationService: ApplicationService,
  ) {}

  list() {
    return this.partnerRepository.findAll();
  }

  register(input: { name: string }) {
    return this.applicationService.run(async () => {
      const partner = Partner.create(input);
      await this.partnerRepository.add(partner);
      return partner;
    });
  }

  update(id: string, input: { name?: string }) {
    return this.applicationService.run(async () => {
      const partner = await this.partnerRepository.findById(new PartnerId(id));
      if (!partner) {
        throw new Error('Partner not found');
      }
      input.name && partner.changeName(input.name);
      await this.partnerRepository.add(partner);
      return partner;
    });
  }
}
