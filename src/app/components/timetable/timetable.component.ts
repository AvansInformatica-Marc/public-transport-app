import { Component, OnInit } from '@angular/core';
import Stop from 'src/app/models/Stop';
import Ride from 'src/app/models/Ride';
import { TimetableService } from 'src/app/services/timetable.service';
import { MatDialog } from '@angular/material';
import { SelectorDialogComponent } from '../stops/selector-dialog/selector-dialog.component';
import { LoginDialogComponent } from '../accounts/login-dialog/login-dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { Entity } from 'src/app/models/Entity';
import { StopService } from 'src/app/services/stop.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OperatorService } from 'src/app/services/operator.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  public selectedStop?: Entity<Stop>
  public timetable: Entity<Ride>[] = []

  constructor(protected timetableService: TimetableService, protected stopService: StopService, public operatorService: OperatorService, public authService: AuthenticationService, public dialog: MatDialog){}

  public async ngOnInit() {
    if(localStorage.getItem("lastStop")){
      this.selectedStop = await this.stopService.getById(localStorage.getItem("lastStop"))
      this.loadTimetable()
    }
  }

  public async openStopSelector(){
    const stop = await this.openDialog<Entity<Stop> | null>(SelectorDialogComponent)
    if(stop){
      this.selectedStop = stop
      localStorage.setItem("lastStop", stop._id)
      this.loadTimetable()
    }
  }

  public async loadTimetable(){
    this.timetable = await this.timetableService.getAll(this.selectedStop._id)
  }

  public async login(){
    const token = await this.openDialog<string | null>(LoginDialogComponent)
    if(token) await this.authService.login(token)
  }

  public async newAccount(){
    const token = await this.openDialog<string | null>(LoginDialogComponent)
    if(token) await this.operatorService.create({ name: token })
  }

  public logout(){
    this.authService.logout()
  }

  private openDialog<T, C = any>(component: ComponentType<C>): Promise<T>{
    return new Promise((resolve, reject) => {
      const dialog = this.dialog.open(component, { width: '300px' })
      dialog.afterClosed().subscribe((result: T) => resolve(result))
    })
  }
}
