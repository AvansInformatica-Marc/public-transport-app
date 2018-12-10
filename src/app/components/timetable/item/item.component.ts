import { Component, OnInit, Input } from '@angular/core';
import { TrainService } from 'src/app/services/train.service';
import { OperatorService } from 'src/app/services/operator.service';
import { StopService } from 'src/app/services/stop.service';
import Ride from 'src/app/models/Ride';

@Component({
  selector: 'app-timetable-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  public settings = localStorage
  public days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  @Input() ride: Ride;

  constructor(protected stopService: StopService, protected operatorService: OperatorService, protected trainService: TrainService){}

  public async ngOnInit(){
    if(typeof this.ride.operator == "string")
      this.ride.operator = await this.operatorService.getById(this.ride.operator)

    if(this.ride.train){
      this.ride.train.forEach(async (trainId, index) => {
        if(typeof trainId == "string")
          this.ride.train[index] = await this.trainService.getById(trainId)
      })
    }

    if(this.ride.stops){
      this.ride.stops.forEach(async (stop, index) => {
        if(typeof stop.stop == "string")
          this.ride.stops[index].stop = await this.stopService.getById(stop.stop)
      })
    }
  }
}
