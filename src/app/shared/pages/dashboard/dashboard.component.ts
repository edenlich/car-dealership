import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../../core/services/dashboard.service';
import { GraphData } from '../../../core/models/graph-data.model';
import { BreakdownGraphData } from '../../../core/models/breakdown-graph-data.model';
import { MotorTableData } from '../../../core/models/motor-table-type.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private readonly HOBBY_GRAPH = 'hobby';
  private readonly CITY_GRAPH = 'city';
  private readonly COLORS_GRAPH = 'color';
  private readonly options = {
    responsive: true,
    maintainAspectRatio: false
  };

  displayedColumns: string[] = ['gender', 'fuel', 'electric'];
  motorTableData!: MotorTableData[];

  @ViewChild('colorsContainer', { static: false }) colorsContainer!: ElementRef;

  constructor(private dashboardService: DashboardService, private renderer: Renderer2) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createHobbiesAmountGraph();
    this.createCitiesAmountGraph();
    this.createMotorAmountTable();
  }

  ngAfterViewInit(): void {
    this.createColorsAmountGraph();
  }

  createHobbiesAmountGraph() {
    this.dashboardService.getHobbiesGraphData()
      .pipe(untilDestroyed(this))
      .subscribe((data: GraphData) => {
        new Chart(this.HOBBY_GRAPH,
          {
            type: 'bar',
            options: this.options,
            data: {
              labels: data.labels,
              datasets: [
                {
                  label: 'Most Common Hobby Amongst Visitors',
                  data: data.amounts
                }
              ]
            }
          }
        );
      });
  }

  createCitiesAmountGraph() {
    this.dashboardService.getCitiesGraphData()
      .pipe(untilDestroyed(this))
      .subscribe((data: GraphData) => {
        new Chart(this.CITY_GRAPH,
          {
            type: 'bar',
            options: this.options,
            data: {
              labels: data.labels,
              datasets: [
                {
                  label: 'Most Common City Amongst Visitors',
                  data: data.amounts
                }
              ]
            }
          }
        );
      });
  }

  createColorsAmountGraph() {
    this.dashboardService.getColorsGraphData()
      .pipe(untilDestroyed(this))
      .subscribe((data: BreakdownGraphData[]) => {
        data.forEach((d) => {
          const id = `${this.COLORS_GRAPH}-${d.step}`;
          this.createColorsCanvasElement(id);
          new Chart(id,
            {
              type: 'bar',
              options: this.options,
              data: {
                labels: d.labels,
                datasets: [
                  {
                    label: `Most Common Favorite Color Amongst ${d.step} Year Olds`,
                    backgroundColor: d.labels,
                    data: d.amounts,
                  }
                ]
              }
            }
          );
        })
      });
  }

  createMotorAmountTable() {
    this.dashboardService.getMotorTableData()
      .pipe(untilDestroyed(this))
      .subscribe((data) => this.motorTableData = data);
  }

  private createColorsCanvasElement(id: string) {
    const graph = this.renderer.createElement('canvas');
    this.renderer.setProperty(graph, 'id', id);
    this.renderer.appendChild(this.colorsContainer.nativeElement, graph);
  }
}
