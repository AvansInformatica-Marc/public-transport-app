import { Component, OnInit } from "@angular/core"
import Stop from "src/app/models/Stop"
import { Observable } from "rxjs"
import { startWith, map } from "rxjs/operators"
import { FormControl } from "@angular/forms"
import { StopService } from "src/app/services/stop.service"
import { MatDialogRef } from "@angular/material"
import { Entity } from "src/app/models/Entity"

@Component({
  selector: "app-selector-dialog",
  templateUrl: "./selector-dialog.component.html",
  styleUrls: ["./selector-dialog.component.css"]
})
export class SelectorDialogComponent implements OnInit {
  public stopControl = new FormControl()
  public options: Entity<Stop>[] = []
  public filteredOptions: Observable<Entity<Stop>[]>

  constructor(protected stopService: StopService, public dialogRef: MatDialogRef<SelectorDialogComponent>) {}

  public async ngOnInit() {
    this.options = await this.stopService.getAll()
    this.filteredOptions = this.stopControl.valueChanges.pipe(
      startWith<string | Entity<Stop>>(""),
      map(value => typeof value === "string" ? value : value.name),
      map(name => this.filter(name))
    )
  }

  public displayStop(stop?: Entity<Stop>): string | undefined {
    return stop ? stop.name : undefined
  }

  private filter(name?: string): Entity<Stop>[] {
    return name ? this.options.filter(option => option.name.toLowerCase().includes(name.toLowerCase())) : this.options
  }

  public closeDialogWithResult() {
    this.dialogRef.close(this.stopControl.value)
  }

  public closeDialogWithoutResult() {
    this.dialogRef.close(null)
  }
}
