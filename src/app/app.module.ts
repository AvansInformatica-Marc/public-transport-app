import { BrowserModule } from "@angular/platform-browser"
import { NgModule } from "@angular/core"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatDividerModule, MatDialogModule,
  MatButtonModule, MatIconModule, MatToolbarModule, MatChipsModule, MatMenuModule, MatCheckboxModule,
  MatSnackBarModule } from "@angular/material"
import { TimetableComponent } from "./components/timetable/timetable.component"
import { ItemComponent } from "./components/timetable/item/item.component"
import { SelectorDialogComponent } from "./components/stops/selector-dialog/selector-dialog.component"
import { AuthInterceptor } from "./services/AuthInterceptor"
import { LoginDialogComponent } from "./components/accounts/login-dialog/login-dialog.component"
import { EditComponent } from "./components/timetable/edit/edit.component"
import { DetailsComponent } from "./components/timetable/details/details.component"
import { TrainDetailsComponent } from "./components/trains/details/details.component"

@NgModule({
  declarations: [
    AppComponent,
    TimetableComponent,
    ItemComponent,
    SelectorDialogComponent,
    LoginDialogComponent,
    EditComponent,
    DetailsComponent,
    TrainDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDividerModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatChipsModule,
    MatMenuModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  entryComponents: [
    SelectorDialogComponent,
    LoginDialogComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
