import { Injectable } from "@angular/core"
import Repository from "./Repository"
import Ride from "../models/Ride"
import { HttpClient } from "@angular/common/http"
import { Entity } from "../models/Entity"
import { CacheService } from "./cache.service"

@Injectable({
  providedIn: "root"
})
export class TimetableService implements Repository<Ride> {
  protected static apiUrl: string = "https://ov-api.herokuapp.com/api/v1/rides"

  constructor(protected http: HttpClient, protected cache: CacheService<Ride>) {}

  public async getById(id: string): Promise<Entity<Ride>> {
    const cachedItem = this.cache.getById(id)
    if (cachedItem) return cachedItem

    const response = await this.http.get<Entity<Ride>>(`${TimetableService.apiUrl}/${id}`).toPromise()
    this.cache.add(response)
    return response
  }

  public async getAll(stopId?: string): Promise<Entity<Ride>[]> {
    const response = await this.http.get<Entity<Ride>[]>(`${TimetableService.apiUrl}${stopId ? `?stopId=${stopId}` : ""}`).toPromise()
    this.cache.add(...response.filter(ride => !this.cache.doesItemExist(ride._id)))
    return response
  }

  public async create(model: Ride): Promise<Entity<Ride>> {
    const response = await this.http.post<Entity<Ride>>(`${TimetableService.apiUrl}`, model).toPromise()
    this.cache.add(response)
    return response
  }

  public async update(id: string, model: Ride): Promise<void> {
    await this.http.put<Ride>(`${TimetableService.apiUrl}/${id}`, model).toPromise()
    this.cache.update(id, model)
  }

  public async delete(id: string): Promise<void> {
    await this.http.delete<Ride>(`${TimetableService.apiUrl}/${id}`).toPromise()
    this.cache.delete(id)
  }
}
