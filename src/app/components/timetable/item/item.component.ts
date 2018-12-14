import { Component, OnInit, Input } from "@angular/core"
import { TrainService } from "src/app/services/train.service"
import { OperatorService } from "src/app/services/operator.service"
import { StopService } from "src/app/services/stop.service"
import Ride from "src/app/models/Ride"
import { Entity } from "src/app/models/Entity"
import { TimetableService } from "src/app/services/timetable.service"
import Stop from "src/app/models/Stop"
import Operator from "src/app/models/Operator"

@Component({
  selector: "app-timetable-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.css"]
})
export class ItemComponent implements OnInit {
  public days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  @Input() ride: Entity<Ride>

  public get direction(): string | undefined {
    return (this.ride.stops[this.ride.stops.length - 1].stop as Stop).name
  }

  public get operatorLogo(): string | undefined {
    return (this.ride.operator as Operator).logo
  }

  constructor(protected timetableService: TimetableService, protected stopService: StopService,
    protected operatorService: OperatorService, protected trainService: TrainService) {}

  public async ngOnInit() {
    if (typeof this.ride.operator === "string")
      this.ride.operator = await this.operatorService.getById(this.ride.operator)

    if (this.ride.train) {
      this.ride.train.forEach(async (trainId, index) => {
        if (typeof trainId === "string")
          this.ride.train[index] = await this.trainService.getById(trainId)
      })
    }

    if (this.ride.stops) {
      this.ride.stops.forEach(async (stop, index) => {
        if (typeof stop.stop === "string")
          this.ride.stops[index].stop = await this.stopService.getById(stop.stop)
      })
    }
  }

  public async deleteItem(id: string) {
    await this.timetableService.delete(id)
  }
}
