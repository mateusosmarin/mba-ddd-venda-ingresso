import { Test, TestingModule } from '@nestjs/testing';
import { EventSectionsController } from './event-sections.controller';

describe.skip('EventSectionsController', () => {
  let controller: EventSectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventSectionsController],
    }).compile();

    controller = module.get<EventSectionsController>(EventSectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
