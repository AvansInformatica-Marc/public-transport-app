import { Component, OnInit } from "@angular/core"
import { TrainService } from "src/app/services/train.service"
import Train from "src/app/models/Train"
import { Entity } from "src/app/models/Entity"

@Component({
  selector: "app-trains",
  templateUrl: "./trains.component.html",
  styleUrls: ["./trains.component.css"]
})
export class TrainsComponent implements OnInit {
  public trains: Entity<Train>[] = []

  constructor(protected trainService: TrainService) {}

  public async ngOnInit() {
    this.trains = await this.trainService.getAll()
  }
}
