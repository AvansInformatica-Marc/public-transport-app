import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Entity } from "../models/Entity"
import Operator from "../models/Operator"

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  public user?: Entity<Operator> | { admin: true }

  constructor(protected http: HttpClient) {
    if (this.token && !this.user)
      this.login(this.token)
  }

  public get token(): string | undefined {
    return localStorage.getItem("token")
  }

  public get isLoggedIn(): boolean {
    return this.token && this.user ? true : false
  }

  public get isAdmin() {
    return this.user && (this.user as { admin?: boolean }).admin
  }

  public async restore() {
    await this.login(this.token)
  }

  public async login(token: string) {
    localStorage.setItem("token", token)
    const response = await this.http.get<Entity<Operator> | { admin: true }>(`https://ov-api.herokuapp.com/api/v1/operators/@me`).toPromise()
    this.user = response
  }

  public logout() {
    this.user = undefined
    localStorage.removeItem("token")
  }
}
