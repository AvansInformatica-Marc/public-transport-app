import { Injectable } from '@angular/core';
import Repository from './Repository';
import Operator from '../models/Operator';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OperatorService implements Repository<Operator> {
  protected cache: Operator[] = []
  protected static apiUrl: string = "https://ov-api.herokuapp.com/api/v1/operators"

  constructor(protected http: HttpClient) {}
  
  public async getById(id: string): Promise<Operator> {
    const cachedItem = this.cache.find(it => it._id == id)
    if(cachedItem) return cachedItem

    const response = await this.http.get<Operator>(`${OperatorService.apiUrl}/${id}`).toPromise()
    this.cache.push(response)
    return response
  }
  
  public async getAll(): Promise<Operator[]> {
    const response = await this.http.get<Operator[]>(`${OperatorService.apiUrl}`).toPromise()
    this.cache.push(...response.filter(operator => !this.cache.some(it => it._id == operator._id)))
    return response
  }
  
  public async create(model: Operator): Promise<Operator> {
    const response = await this.http.post<Operator>(`${OperatorService.apiUrl}`, model).toPromise()
    this.cache.push(response)
    return response
  }
  
  public async update(id: string, model: Operator): Promise<void> {
    await this.http.put<Operator>(`${OperatorService.apiUrl}/${id}`, model).toPromise()
    this.cache.splice(this.cache.findIndex(it => it._id == id), 1, model)
  }
  
  public async delete(id: string): Promise<void> {
    await this.http.delete<Operator>(`${OperatorService.apiUrl}/${id}`).toPromise()
    this.cache.splice(this.cache.findIndex(it => it._id == id), 1)
  }
}