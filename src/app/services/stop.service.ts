import { Injectable } from '@angular/core';
import Repository from './Repository';
import Stop from '../models/Stop';
import { HttpClient } from '@angular/common/http';
import Cache from "./Cache"
import { Entity } from '../models/Entity';

@Injectable({
  providedIn: 'root'
})
export class StopService implements Repository<Stop> {
  protected cache: Cache<Stop> = new Cache<Stop>()
  protected static apiUrl: string = "https://ov-api.herokuapp.com/api/v1/stops"

  constructor(protected http: HttpClient) {}
  
  public async getById(id: string): Promise<Entity<Stop>> {
    const cachedItem = this.cache.getById(id)
    if(cachedItem) return cachedItem

    const response = await this.http.get<Entity<Stop>>(`${StopService.apiUrl}/${id}`).toPromise()
    this.cache.add(response)
    return response
  }
  
  public async getAll(): Promise<Entity<Stop>[]> {
    const response = await this.http.get<Entity<Stop>[]>(`${StopService.apiUrl}`).toPromise()
    this.cache.add(...response.filter(stop => !this.cache.doesItemExist(stop._id)))
    return response
  }
  
  public async create(model: Stop): Promise<Entity<Stop>> {
    const response = await this.http.post<Entity<Stop>>(`${StopService.apiUrl}`, model).toPromise()
    this.cache.add(response)
    return response
  }
  
  public async update(id: string, model: Stop): Promise<void> {
    await this.http.put(`${StopService.apiUrl}/${id}`, model).toPromise()
    this.cache.update(id, model)
  }
  
  public async delete(id: string): Promise<void> {
    await this.http.delete(`${StopService.apiUrl}/${id}`).toPromise()
    this.cache.delete(id)
  }
}
