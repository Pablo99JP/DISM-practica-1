import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarFichajePage } from './registrar-fichaje.page';

describe('RegistrarFichajePage', () => {
  let component: RegistrarFichajePage;
  let fixture: ComponentFixture<RegistrarFichajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarFichajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
