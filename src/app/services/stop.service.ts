import { Injectable } from '@angular/core';
import Repository from './Repository';
import Stop from '../models/Stop';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StopService implements Repository<Stop> {
  protected cache: Stop[] = []
  protected static apiUrl: string = "http://localhost:8080/api/v1/stops"

  constructor(protected http: HttpClient) {}
  
  public async getById(id: string): Promise<Stop> {
    const cachedItem = this.cache.find(it => it._id == id)
    if(cachedItem) return cachedItem

    const response = await this.http.get<Stop>(`${StopService.apiUrl}/${id}`).toPromise()
    this.cache.push(response)
    return response
  }
  
  public async getAll(): Promise<Stop[]> {
    const response = await this.http.get<Stop[]>(`${StopService.apiUrl}`).toPromise()
    this.cache.push(...response.filter(stop => !this.cache.some(it => it._id == stop._id)))
    return response
  }
  
  public async create(model: Stop): Promise<Stop> {
    const response = await this.http.post<Stop>(`${StopService.apiUrl}`, model).toPromise()
    this.cache.push(response)
    return response
  }
  
  public async update(id: string, model: Stop): Promise<void> {
    await this.http.put<Stop>(`${StopService.apiUrl}/${id}`, model).toPromise()
    this.cache.splice(this.cache.findIndex(it => it._id == id), 1, model)
  }
  
  public async delete(id: string): Promise<void> {
    await this.http.delete<Stop>(`${StopService.apiUrl}/${id}`).toPromise()
    this.cache.splice(this.cache.findIndex(it => it._id == id), 1)
  }
}
