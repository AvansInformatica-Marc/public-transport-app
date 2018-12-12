import { Injectable } from '@angular/core';
import Repository from './Repository';
import Operator from '../models/Operator';
import { HttpClient } from '@angular/common/http';
import { Entity } from '../models/Entity';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class OperatorService implements Repository<Operator> {
  protected static apiUrl: string = "https://ov-api.herokuapp.com/api/v1/operators"

  constructor(protected http: HttpClient, protected cache: CacheService<Operator>) {}
  
  public async getById(id: string): Promise<Entity<Operator>> {
    const cachedItem = this.cache.getById(id)
    if(cachedItem) return cachedItem

    const response = await this.http.get<Entity<Operator>>(`${OperatorService.apiUrl}/${id}`).toPromise()
    this.cache.add(response)
    return response
  }
  
  public async getAll(): Promise<Entity<Operator>[]> {
    const response = await this.http.get<Entity<Operator>[]>(`${OperatorService.apiUrl}`).toPromise()
    this.cache.add(...response.filter(operator => !this.cache.doesItemExist(operator._id)))
    return response
  }
  
  public async create(model: Operator): Promise<Entity<Operator>> {
    const response = await this.http.post<Entity<Operator>>(`${OperatorService.apiUrl}`, model).toPromise()
    this.cache.add(response)
    return response
  }
  
  public async update(id: string, model: Operator): Promise<void> {
    await this.http.put(`${OperatorService.apiUrl}/${id}`, model).toPromise()
    this.cache.update(id, model)
  }
  
  public async delete(id: string): Promise<void> {
    await this.http.delete(`${OperatorService.apiUrl}/${id}`).toPromise()
    this.cache.delete(id)
  }
}