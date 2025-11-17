import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Métodos para Usuarios
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

  // Métodos para Trabajos
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

  // Métodos para Fichajes
  getFichajes(params?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fichajes`, { params });
  }

  deleteFichaje(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/fichajes/${id}`);
  }
}