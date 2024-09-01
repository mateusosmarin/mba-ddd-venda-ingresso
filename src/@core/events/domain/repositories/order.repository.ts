import { Repository } from 'src/@core/common/domain/repository';
import { Order, OrderId } from '../entities/order.entity';

export interface OrderRepository extends Repository<Order, OrderId> {}
