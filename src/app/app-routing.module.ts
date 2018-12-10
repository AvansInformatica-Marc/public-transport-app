import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimetableComponent } from './components/timetable/timetable.component';
import { EditComponent } from './components/timetable/edit/edit.component';
import { DetailsComponent } from './components/timetable/details/details.component';

const routes: Routes = [
  { path: "timetable", component: TimetableComponent, children: [
    { path: "new", component: EditComponent },
    { path: ":id", component: DetailsComponent },
    { path: ":id/edit", component: EditComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
