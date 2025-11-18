import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LoginPage {
  usuario: string = '';
  clave: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  async login() {
    if (!this.usuario || !this.clave) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.authService.login(this.usuario, this.clave).subscribe({
      next: () => {
        this.router.navigate(['/tabs']);
      },
      error: async (err) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Usuario o contraseña incorrectos',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }
}