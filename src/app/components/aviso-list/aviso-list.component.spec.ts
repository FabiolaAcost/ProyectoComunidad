import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AvisoListComponent } from './aviso-list.component';

describe('AvisoListComponent', () => {
  let component: AvisoListComponent;
  let fixture: ComponentFixture<AvisoListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AvisoListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
