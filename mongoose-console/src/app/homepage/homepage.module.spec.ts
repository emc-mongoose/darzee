import { HomepageModule } from './homepage.module';

describe('HomepageModule', () => {
  let homepageModule: HomepageModule;

  beforeEach(() => {
    homepageModule = new HomepageModule();
  });

  it('should create an instance', () => {
    expect(homepageModule).toBeTruthy();
  });
});
