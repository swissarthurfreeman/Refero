import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColConfigComponent } from './col-config.component';

describe('ColConfigComponent', () => {
  let component: ColConfigComponent;
  let fixture: ComponentFixture<ColConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
