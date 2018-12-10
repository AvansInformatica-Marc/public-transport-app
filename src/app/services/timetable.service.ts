import { Injectable } from '@angular/core';
import Repository from './Repository';
import Ride from '../models/Ride';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TimetableService implements Repository<Ride> {
  protected cache: Ride[] = []
  protected static apiUrl: string = "http://localhost:8080/api/v1/rides"

  constructor(protected http: HttpClient) {}
  
  public async getById(id: string): Promise<Ride> {
    const cachedItem = this.cache.find(it => it._id == id)
    if(cachedItem) return cachedItem

    const response = await this.http.get<Ride>(`${TimetableService.apiUrl}/${id}`).toPromise()
    this.cache.push(response)
    return response
  }
  
  public async getAll(stopId?: string): Promise<Ride[]> {
    const response = await this.http.get<Ride[]>(`${TimetableService.apiUrl}${stopId ? `?stopId=${stopId}` : ""}`).toPromise()
    this.cache.push(...response.filter(ride => !this.cache.some(it => it._id == ride._id)))
    return response
  }
  
  public async create(model: Ride): Promise<Ride> {
    const response = await this.http.post<Ride>(`${TimetableService.apiUrl}`, model).toPromise()
    this.cache.push(response)
    return response
  }
  
  public async update(id: string, model: Ride): Promise<void> {
    await this.http.put<Ride>(`${TimetableService.apiUrl}/${id}`, model).toPromise()
    this.cache.splice(this.cache.findIndex(it => it._id == id), 1, model)
  }
  
  public async delete(id: string): Promise<void> {
    await this.http.delete<Ride>(`${TimetableService.apiUrl}/${id}`).toPromise()
    this.cache.splice(this.cache.findIndex(it => it._id == id), 1)
  }
}
