import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonSelect, IonSelectOption,
  IonItem, IonLabel
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-registrar-fichaje',
  templateUrl: './registrar-fichaje.page.html',
  styleUrls: ['./registrar-fichaje.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule,
    IonButton, IonSelect, IonSelectOption, IonItem, IonLabel],
})
export class RegistrarFichajePage implements OnInit {

  // Estado del fichaje
  tieneFichajeAbierto: boolean = false;
  fichajeAbierto: any | undefined;

  // Datos del usuario y selección
  userId: number = 1;
  trabajoSeleccionado: number | null = null;
  currentLat: number = 0;
  currentLng: number = 0;

  // Lista de trabajos
  trabajos: { IdTrabajo: number, Nombre: string }[] = [];

  constructor(private http: HttpClient, private geolocation: Geolocation) { }

  // 🔧 FUNCIÓN AUXILIAR: Convertir Date a formato MySQL local
  private dateToMySQLFormat(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  ngOnInit() {
    const ahora = new Date();

    this.http.get<any[]>(`http://localhost:3000/fichajes?usuario=${this.userId}`)
      .subscribe((fichajes) => {
        
        console.log('📥 Fichajes recibidos del servidor:', fichajes);
        
        const fichajesRecientes = fichajes.filter(f => {
          const fechaEntrada = new Date(f.FechaHoraEntrada);
          
          // Si tiene fecha de salida válida, no está abierto
          if (f.FechaHoraSalida) {
            const fechaSalida = new Date(f.FechaHoraSalida);
            if (fechaSalida > fechaEntrada) {
              return false;
            }
          }
          
          const horasTranscurridas = (ahora.getTime() - fechaEntrada.getTime()) / (1000 * 60 * 60);
          return horasTranscurridas < 12;
        });

        const ultimo = fichajesRecientes.sort((a, b) =>
          new Date(b.FechaHoraEntrada).getTime() - new Date(a.FechaHoraEntrada).getTime()
        )[0];

        this.tieneFichajeAbierto = !!ultimo;
        this.fichajeAbierto = ultimo;
        
        if (ultimo) {
          console.log('✅ Fichaje abierto encontrado:');
          console.log('  - ID:', ultimo.IdFichaje);
          console.log('  - FechaHoraEntrada (raw):', ultimo.FechaHoraEntrada);
          console.log('  - FechaHoraEntrada (Date):', new Date(ultimo.FechaHoraEntrada).toString());
          console.log('  - Hora local:', new Date(ultimo.FechaHoraEntrada).toLocaleString('es-ES'));
        }
      });

    this.http.get<any[]>('http://localhost:3000/trabajos')
      .subscribe((res) => this.trabajos = res);
  }

  async iniciarFichaje() {
    if (!this.trabajoSeleccionado) return;

    try {
      const position = await Geolocation.getCurrentPosition();
      
      const ahora = new Date();
      const fechaMySQL = this.dateToMySQLFormat(ahora);
      
      console.log('📤 INICIANDO FICHAJE:');
      console.log('  - Fecha local:', ahora.toString());
      console.log('  - Fecha formato MySQL:', fechaMySQL);
      
      const nuevo = {
        FechaHoraEntrada: fechaMySQL, // ✅ Formato MySQL local
        IdUsuario: this.userId,
        IdTrabajo: this.trabajoSeleccionado,
        GeolocalizacionLatitud: position.coords.latitude,
        GeolocalizacionLongitud: position.coords.longitude
      };

      this.http.post('http://localhost:3000/fichajes', nuevo)
        .subscribe((respuesta: any) => {
          console.log('✅ RESPUESTA POST:', respuesta);
          this.ngOnInit();
        });
    } catch (err) {
      console.error('❌ Error obteniendo geolocalización:', err);
    }
  }

  cerrarFichaje() {
    if (!this.fichajeAbierto) return;

    const ahora = new Date();
    const fechaSalidaMySQL = this.dateToMySQLFormat(ahora);
    
    // IMPORTANTE: No modificar FechaHoraEntrada, mantenerla como está
    const fechaEntradaOriginal = this.fichajeAbierto.FechaHoraEntrada;
    const fechaEntrada = new Date(fechaEntradaOriginal);

    console.log('🔚 CERRANDO FICHAJE:');
    console.log('  - Fichaje ID:', this.fichajeAbierto.IdFichaje);
    console.log('  - FechaEntrada ORIGINAL (del servidor):', fechaEntradaOriginal);
    console.log('  - FechaEntrada convertida a Date:', fechaEntrada.toString());
    console.log('  - FechaSalida actual:', ahora.toString());
    console.log('  - FechaSalida formato MySQL:', fechaSalidaMySQL);

    // Calcular horas trabajadas
    const horasTrabajadas = (ahora.getTime() - fechaEntrada.getTime()) / (1000 * 60 * 60);
    
    console.log('  - Milisegundos entrada:', fechaEntrada.getTime());
    console.log('  - Milisegundos salida:', ahora.getTime());
    console.log('  - Diferencia ms:', ahora.getTime() - fechaEntrada.getTime());
    console.log('  - ⏱️ Horas trabajadas:', horasTrabajadas.toFixed(2));

    const update = {
      // ✅ CRÍTICO: Enviar FechaHoraEntrada sin modificar
      FechaHoraEntrada: fechaEntradaOriginal,
      FechaHoraSalida: fechaSalidaMySQL,
      HorasTrabajadas: Number(horasTrabajadas.toFixed(2)),
      IdTrabajo: this.fichajeAbierto.IdTrabajo,
      IdUsuario: this.fichajeAbierto.IdUsuario,
      GeolocalizacionLatitud: this.fichajeAbierto.GeolocalizacionLatitud,
      GeolocalizacionLongitud: this.fichajeAbierto.GeolocalizacionLongitud
    };
    
    console.log('📤 OBJETO A ENVIAR:', update);

    this.http.put(`http://localhost:3000/fichajes/${this.fichajeAbierto.IdFichaje}`, update)
      .subscribe((res: any) => {
        console.log('✅ RESPUESTA PUT:', res);
        console.log('  - FechaEntrada devuelta:', res.FechaHoraEntrada);
        console.log('  - FechaSalida devuelta:', res.FechaHoraSalida);
        
        this.fichajeAbierto = res;
        this.tieneFichajeAbierto = false;
        this.ngOnInit();
      });
  }
}