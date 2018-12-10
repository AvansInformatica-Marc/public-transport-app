import { Component, OnInit } from '@angular/core';
import Stop from 'src/app/models/Stop';
import Ride from 'src/app/models/Ride';
import { StopService } from 'src/app/services/stop.service';
import { TimetableService } from 'src/app/services/timetable.service';
import { OperatorService } from 'src/app/services/operator.service';
import { TrainService } from 'src/app/services/train.service';
import { MatDialog } from '@angular/material';
import { SelectorDialogComponent } from '../stops/selector-dialog/selector-dialog.component';
import { LoginDialogComponent } from '../accounts/login-dialog/login-dialog.component';
import { ComponentType } from '@angular/cdk/portal';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  public settings = localStorage
  public selectedStop?: Stop
  public timetable: Ride[] = [];

  constructor(protected timetableService: TimetableService, public dialog: MatDialog){}

  public ngOnInit() {}

  public async openStopSelector(){
    const stop = await this.openDialog<Stop | null>(SelectorDialogComponent)
    if(stop){
      this.selectedStop = stop
      this.loadTimetable()
    }
  }

  public async loadTimetable(){
    this.timetable = await this.timetableService.getAll(this.selectedStop._id)
  }

  public async login(){
    const token = await this.openDialog<string | null>(LoginDialogComponent)
    if(token) this.settings.setItem("accountToken", token)
  }

  public logout(){
    this.settings.removeItem("accountToken")
  }

  private openDialog<T, C = any>(component: ComponentType<C>): Promise<T>{
    return new Promise((resolve, reject) => {
      const dialog = this.dialog.open(component, { width: '300px' })
      dialog.afterClosed().subscribe((result: T) => resolve(result))
    })
  }
}
