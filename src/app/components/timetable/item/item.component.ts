import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-timetable-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  public settings = localStorage
  public days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  @Input() ride;

  public ngOnInit(){}
}
