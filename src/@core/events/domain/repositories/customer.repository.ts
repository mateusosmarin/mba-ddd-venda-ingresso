import { Repository } from 'src/@core/common/domain/repository';
import { Customer, CustomerId } from '../entities/customer.entity';

export interface CustomerRepository extends Repository<Customer, CustomerId> {}
