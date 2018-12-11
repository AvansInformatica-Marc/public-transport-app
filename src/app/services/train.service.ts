import { Injectable } from '@angular/core';
import Repository from './Repository';
import Train from '../models/Train';
import { HttpClient } from '@angular/common/http';
import Cache from './Cache';
import { Entity } from '../models/Entity';

@Injectable({
  providedIn: 'root'
})
export class TrainService implements Repository<Train> {
  protected cache: Cache<Train> = new Cache<Train>()
  protected static apiUrl: string = "https://ov-api.herokuapp.com/api/v1/trains"

  constructor(protected http: HttpClient) {}
  
  public async getById(id: string): Promise<Entity<Train>> {
    const cachedItem = this.cache.getById(id)
    if(cachedItem) return cachedItem

    const response = await this.http.get<Train>(`${TrainService.apiUrl}/${id}`).toPromise()
    this.cache.add(response)
    return response
  }
  
  public async getAll(): Promise<Entity<Train>[]> {
    const response = await this.http.get<Entity<Train>[]>(`${TrainService.apiUrl}`).toPromise()
    this.cache.add(...response.filter(train => !this.cache.doesItemExist(train._id)))
    return response
  }
  
  public async create(model: Train): Promise<Entity<Train>> {
    const response = await this.http.post<Entity<Train>>(`${TrainService.apiUrl}`, model).toPromise()
    this.cache.add(response)
    return response
  }
  
  public async update(id: string, model: Train): Promise<void> {
    await this.http.put<Train>(`${TrainService.apiUrl}/${id}`, model).toPromise()
    this.cache.update(id, model)
  }
  
  public async delete(id: string): Promise<void> {
    await this.http.delete<Train>(`${TrainService.apiUrl}/${id}`).toPromise()
    this.cache.delete(id)
  }
}
