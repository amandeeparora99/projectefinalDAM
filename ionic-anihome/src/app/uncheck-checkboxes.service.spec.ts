import { TestBed } from '@angular/core/testing';

import { UncheckCheckboxesService } from './uncheck-checkboxes.service';

describe('UncheckCheckboxesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UncheckCheckboxesService = TestBed.get(UncheckCheckboxesService);
    expect(service).toBeTruthy();
  });
});
