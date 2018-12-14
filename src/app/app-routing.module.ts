import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"
import { TimetableComponent } from "./components/timetable/timetable.component"
import { EditComponent } from "./components/timetable/edit/edit.component"
import { DetailsComponent } from "./components/timetable/details/details.component"
import { TrainDetailsComponent } from "./components/trains/details/details.component"

const routes: Routes = [
  { path: "trains", component: TrainDetailsComponent, children: [
    { path: ":id", component: TrainDetailsComponent }
  ] },
  { path: "timetable", component: TimetableComponent },
  { path: "timetable/new", component: EditComponent },
  { path: "timetable/:id", component: DetailsComponent },
  { path: "timetable/:id/edit", component: EditComponent },
  { path: "", redirectTo: "/timetable", pathMatch: "full" }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
