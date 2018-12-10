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

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  public settings = localStorage
  public selectedStop?: Stop
  public timetable: Ride[] = [];

  constructor(protected stopService: StopService, 
    protected timetableService: TimetableService, 
    protected operatorService: OperatorService,
    protected trainService: TrainService,
    public dialog: MatDialog){}

  public ngOnInit() {}

  public openStopSelector(){
    const dialogRef = this.dialog.open(SelectorDialogComponent, { width: '250px' })
    dialogRef.afterClosed().subscribe((result: Stop | null) => {
      if(result){
        this.selectedStop = result
        this.loadTimetable()
      }
    })
  }

  public async loadTimetable(){
    this.timetable = await this.timetableService.getAll(this.selectedStop._id)
    this.timetable.forEach(async ride => {
      if(typeof ride.operator == "string")
      ride.operator = await this.operatorService.getById(ride.operator)

      if(ride.train){
        ride.train.forEach(async (trainId, index) => {
          if(typeof trainId == "string")
            ride.train[index] = await this.trainService.getById(trainId)
        })
      }

      if(ride.stops){
        ride.stops.forEach(async (stop, index) => {
          if(typeof stop.stop == "string")
            ride.stops[index].stop = await this.stopService.getById(stop.stop)
        })
      }
    })
  }

  public login(){
    const dialogRef = this.dialog.open(LoginDialogComponent, { width: '250px' })
    dialogRef.afterClosed().subscribe((result: string | null) => {
      if(result) this.settings.setItem("accountToken", result)
    })
  }

  public logout(){
    this.settings.removeItem("accountToken")
  }
}
