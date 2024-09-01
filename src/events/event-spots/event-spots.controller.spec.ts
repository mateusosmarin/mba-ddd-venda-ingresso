import { Test, TestingModule } from '@nestjs/testing';
import { EventSpotsController } from './event-spots.controller';

describe.skip('EventSpotsController', () => {
  let controller: EventSpotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventSpotsController],
    }).compile();

    controller = module.get<EventSpotsController>(EventSpotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
