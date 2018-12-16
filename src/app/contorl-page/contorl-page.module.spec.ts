import { ContorlPageModule } from './contorl-page.module';

describe('ContorlPageModule', () => {
  let contorlPageModule: ContorlPageModule;

  beforeEach(() => {
    contorlPageModule = new ContorlPageModule();
  });

  it('should create an instance', () => {
    expect(contorlPageModule).toBeTruthy();
  });
});
