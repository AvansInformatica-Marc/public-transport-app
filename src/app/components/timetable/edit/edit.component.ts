import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import Ride from 'src/app/models/Ride';
import { TimetableService } from 'src/app/services/timetable.service';
import { ActivatedRoute } from '@angular/router';
import { Entity } from 'src/app/models/Entity';
import { MatChipInputEvent, MatDialog, MatSnackBar } from '@angular/material';
import { StopService } from 'src/app/services/stop.service';
import { ComponentType } from '@angular/cdk/portal';
import Stop from 'src/app/models/Stop';
import { SelectorDialogComponent } from '../../stops/selector-dialog/selector-dialog.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public id: string | null = null
  public ride: Ride | Entity<Ride> | {[key: string]: any} = { 
    departures: [],
    stops: []
  }
  public days = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }
  public readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  constructor(protected route: ActivatedRoute, protected timetableService: TimetableService, protected stopService: StopService, public dialog: MatDialog, public snackBar: MatSnackBar) { }

  public ngOnInit() {
    (this.route.firstChild || this.route).params.subscribe(async params => {
      if(params && params['id']) {
        this.id = params['id']
        const ride = await this.timetableService.getById(params['id'])
        Object.keys(this.days).map(it => parseInt(it)).forEach(it => this.days[it] = !ride.excludeDays.includes(it as 0 | 1 | 2 | 3 | 4 | 5 | 6))
        ride.stops = await Promise.all(ride.stops.map(async it => {
          (it as any).name = (await this.stopService.getById((it.stop as any)._id || it.stop)).name
          return it
        }))
        this.ride = ride
      }
    })
  }

  public async onSubmit(){
    const model = this.ride as Ride
    if((model as Entity<Ride>)._id) 
      (model as Entity<Ride>)._id = undefined

    if(model.departures.length == 0) {
      this.snackBar.open(`A ride must depart at least once`, 'Ok')
      return
    }
    
    if(model.stops.length < 2) {
      this.snackBar.open(`A ride must stop on at least 2 stops`, 'Ok')
      return
    }
    
    if(model.stops.some(it => !it.stop)) {
      this.snackBar.open(`Stop ${model.stops.findIndex(it => !it.stop) + 1} is not linked to a stop`, 'Ok')
      return
    }

    model.stops[0].arrivalAfter = undefined
    model.stops[0].waitingTime = undefined
    model.excludeDays = Object.keys(this.days).map(it => parseInt(it)).filter(it => !this.days[it]) as (0 | 1 | 2 | 3 | 4 | 5 | 6)[]
    
    if(model.excludeDays.length == 7) {
      this.snackBar.open(`A ride must ride on at least 1 day`, 'Ok')
      return
    }
    
    if(this.id) this.timetableService.update(this.id, model)
    else this.timetableService.create(model)
  }

  public addDeparture(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim() && value.trim().match(/((0|1)([0-9])|2([0-3])):([0-5][0-9])/g)) this.ride.departures.push(value.trim())
    if (input) input.value = ''
  }

  public removeDeparture(departure: string): void {
    const index = this.ride.departures.indexOf(departure);
    if (index >= 0) this.ride.departures.splice(index, 1);
  }

  public addStop(){
    this.ride.stops.push({})
  }

  public deleteStop(stop: any){
    this.ride.stops.splice(this.ride.stops.indexOf(stop), 1)
  }

  public async openStopSelector(stopItem: any){
    const stop = await this.openDialog<Entity<Stop> | null>(SelectorDialogComponent)
    if(stop){
      stopItem.stop = stop._id
      stopItem.name = stop.name
    }
  }

  private openDialog<T, C = any>(component: ComponentType<C>): Promise<T>{
    return new Promise((resolve, reject) => {
      const dialog = this.dialog.open(component, { width: '300px' })
      dialog.afterClosed().subscribe((result: T) => resolve(result))
    })
  }

  public async deleteItem(id: string){
    await this.timetableService.delete(id)
  }
}
