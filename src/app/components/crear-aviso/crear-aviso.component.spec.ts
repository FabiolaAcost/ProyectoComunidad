import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrearAvisoComponent } from './crear-aviso.component';

describe('CrearAvisoComponent', () => {
  let component: CrearAvisoComponent;
  let fixture: ComponentFixture<CrearAvisoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CrearAvisoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
