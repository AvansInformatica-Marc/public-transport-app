import { Injectable } from "@angular/core"
import { Entity } from "../models/Entity"

@Injectable({
  providedIn: "root"
})
export class CacheService<T> {
  protected cache: Entity<T>[] = []

  public add(...models: Entity<T>[]) {
    this.cache.push(...models)
  }

  public getById(id: string): Entity<T> | null {
    return this.cache.find(it => it._id == id) || null
  }

  public doesItemExist(id: string): boolean {
    return this.cache.some(it => it._id == id)
  }

  public update(id: string, model: T) {
    const entity: Entity<T> = model as Entity<T>
    entity._id = id
    this.cache.splice(this.cache.findIndex(it => it._id == id), 1, entity)
  }

  public delete(id: string) {
    this.cache.splice(this.cache.findIndex(it => it._id == id), 1)
  }
}
