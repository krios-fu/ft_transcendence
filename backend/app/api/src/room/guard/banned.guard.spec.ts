import { BannedGuard } from './banned.guard';

describe('BannedGuard', () => {
  it('should be defined', () => {
    expect(new BannedGuard()).toBeDefined();
  });
});
