import { Component, OnInit } from "@angular/core"
import { MatDialogRef } from "@angular/material"
import { FormControl } from "@angular/forms"

@Component({
  selector: "app-login-dialog",
  templateUrl: "./login-dialog.component.html",
  styleUrls: ["./login-dialog.component.css"]
})
export class LoginDialogComponent implements OnInit {
  public tokenControl = new FormControl()

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>) {}

  public ngOnInit() {}

  public closeDialogWithResult() {
    this.dialogRef.close(this.tokenControl.value)
  }

  public closeDialogWithoutResult() {
    this.dialogRef.close(null)
  }
}
