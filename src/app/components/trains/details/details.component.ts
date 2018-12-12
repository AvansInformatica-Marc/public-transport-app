import { Component, OnInit } from '@angular/core';
import { TrainService } from 'src/app/services/train.service';
import Train from 'src/app/models/Train';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class TrainDetailsComponent implements OnInit {
  public train?: Train

  constructor(protected route: ActivatedRoute, protected trainService: TrainService) {}

  public ngOnInit() {
    (this.route.firstChild || this.route).params.subscribe(async params => {
      if(params && params['id']) this.train = await this.trainService.getById(params['id'])
    })
  }
}
