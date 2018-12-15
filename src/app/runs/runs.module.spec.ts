import { RunsModule } from './runs.module';

describe('RunsModule', () => {
  let runsModule: RunsModule;

  beforeEach(() => {
    runsModule = new RunsModule();
  });

  it('should create an instance', () => {
    expect(runsModule).toBeTruthy();
  });
});
