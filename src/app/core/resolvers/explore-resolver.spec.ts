import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { exploreResolver } from './explore-resolver';

describe('exploreResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => exploreResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
