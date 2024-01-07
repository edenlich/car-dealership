import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardModuleRoutingModule } from './dashboard-routing.module';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardModuleRoutingModule,
    MatTableModule,
  ]
})
export class DashboardModule { }
