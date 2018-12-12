import { Component, OnInit } from '@angular/core';
import Ride from 'src/app/models/Ride';
import { TimetableService } from 'src/app/services/timetable.service';
import { ActivatedRoute } from '@angular/router';
import { StopService } from 'src/app/services/stop.service';
import { OperatorService } from 'src/app/services/operator.service';
import { TrainService } from 'src/app/services/train.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  public ride?: Ride
  public days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  public stopDisplayList: any = []

  constructor(protected route: ActivatedRoute, protected timetableService: TimetableService, protected stopService: StopService, protected operatorService: OperatorService, protected trainService: TrainService) {}

  public ngOnInit() {
    (this.route.firstChild || this.route).params.subscribe(async params => {
      if(params && params['id']){ 
        this.ride = await this.timetableService.getById(params['id'])

        if(typeof this.ride.operator == "string")
          this.ride.operator = await this.operatorService.getById(this.ride.operator)

        if(this.ride.train){
          this.ride.train.forEach(async (trainId, index) => {
            if(typeof trainId == "string")
              this.ride.train[index] = await this.trainService.getById(trainId)
          })
        }

        if(this.ride.stops){
          this.ride.stops = await Promise.all(this.ride.stops.map(async stop => {
            if(typeof stop.stop == "string")
              stop.stop = await this.stopService.getById(stop.stop)
            return stop
          }))
          this.ride.stops.forEach(stop => {
            if(stop.arrivalAfter) 
              this.stopDisplayList.push({displayTime: stop.arrivalAfter})
            this.stopDisplayList.push(stop)
          })
        }
      }
    })
  }
}
