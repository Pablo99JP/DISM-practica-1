/**
 * SERVICIO DE API - CAPA DE COMUNICACIÓN CON EL BACKEND
 * ======================================================
 * Este servicio centraliza todas las peticiones HTTP a la API REST.
 * 
 * Conceptos Angular importantes:
 * - @Injectable: Permite inyectar este servicio en componentes
 * - providedIn: 'root' = Singleton (una única instancia en toda la app)
 * - HttpClient: Módulo de Angular para hacer peticiones HTTP
 * - Observable: Patrón reactivo para manejar respuestas asíncronas (similar a Promises)
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Servicio disponible globalmente
})
export class ApiService {
  // URL base de la API REST (backend Node.js)
  private apiUrl = 'http://localhost:8080/api';

  /**
   * Constructor con inyección de dependencias
   * Angular inyecta automáticamente HttpClient
   */
  constructor(private http: HttpClient) { }

  // ==========================================
  // MÉTODOS PARA GESTIÓN DE USUARIOS
  // ==========================================
  
  /**
   * Obtener todos los usuarios
   * @returns Observable con array de usuarios
   */
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarios/${id}`);
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios`, usuario);
  }

  updateUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/usuarios/${id}`);
  }

  // ==========================================
  // MÉTODOS PARA GESTIÓN DE TRABAJOS
  // ==========================================
  
  /**
   * Obtener todos los trabajos/proyectos
   */
  getTrabajos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trabajos`);
  }

  getTrabajoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/trabajos/${id}`);
  }

  createTrabajo(trabajo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/trabajos`, trabajo);
  }

  updateTrabajo(id: number, trabajo: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/trabajos/${id}`, trabajo);
  }

  deleteTrabajo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/trabajos/${id}`);
  }

  // ==========================================
  // MÉTODOS PARA GESTIÓN DE FICHAJES
  // ==========================================
  
  /**
   * Obtener fichajes con filtros opcionales
   * @param params - Objeto con parámetros de filtro (usuario, desde, hasta)
   * 
   * Ejemplo de uso:
   * getFichajes({ usuario: 1, desde: '2025-01-01', hasta: '2025-12-31' })
   */
  getFichajes(params?: any): Observable<any[]> {
    // HttpClient convierte automáticamente params en query string
    // Ejemplo: /fichajes?usuario=1&desde=2025-01-01
    return this.http.get<any[]>(`${this.apiUrl}/fichajes`, { params });
  }

  /**
   * Eliminar un fichaje por su ID
   */
  deleteFichaje(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/fichajes/${id}`);
  }
}