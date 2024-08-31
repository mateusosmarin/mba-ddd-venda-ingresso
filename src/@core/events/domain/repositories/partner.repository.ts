import { Repository } from 'src/@core/common/domain/repository';
import { Partner, PartnerId } from '../entities/partner.entity';

export interface PartnerRepository extends Repository<Partner, PartnerId> {}
