import { ControlEditingModule } from './control-editing.module';

describe('ControlEditingModule', () => {
  let controlEditingModule: ControlEditingModule;

  beforeEach(() => {
    controlEditingModule = new ControlEditingModule();
  });

  it('should create an instance', () => {
    expect(controlEditingModule).toBeTruthy();
  });
});
