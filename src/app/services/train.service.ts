import { Injectable } from '@angular/core';
import Repository from './Repository';
import Train from '../models/Train';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrainService implements Repository<Train> {
  protected cache: Train[] = []
  protected static apiUrl: string = "http://localhost:8080/api/v1/trains"

  constructor(protected http: HttpClient) {}
  
  public async getById(id: string): Promise<Train> {
    const cachedItem = this.cache.find(it => it._id == id)
    if(cachedItem) return cachedItem

    const response = await this.http.get<Train>(`${TrainService.apiUrl}/${id}`).toPromise()
    this.cache.push(response)
    return response
  }
  
  public async getAll(): Promise<Train[]> {
    const response = await this.http.get<Train[]>(`${TrainService.apiUrl}`).toPromise()
    this.cache.push(...response.filter(train => !this.cache.some(it => it._id == train._id)))
    return response
  }
  
  public async create(model: Train): Promise<Train> {
    const response = await this.http.post<Train>(`${TrainService.apiUrl}`, model).toPromise()
    this.cache.push(response)
    return response
  }
  
  public async update(id: string, model: Train): Promise<void> {
    await this.http.put<Train>(`${TrainService.apiUrl}/${id}`, model).toPromise()
    this.cache.splice(this.cache.findIndex(it => it._id == id), 1, model)
  }
  
  public async delete(id: string): Promise<void> {
    await this.http.delete<Train>(`${TrainService.apiUrl}/${id}`).toPromise()
    this.cache.splice(this.cache.findIndex(it => it._id == id), 1)
  }
}
