import { Component, computed, effect, inject, input, OnInit } from "@angular/core";
import { ChartModule } from "primeng/chart";
import { Skeleton } from "primeng/skeleton";
import { buildAnnualChart } from "../../utils/chart.utility";
import { AnnualTotal } from "../../models/expense";

@Component({
  selector: "app-expense-stats",
  imports: [ChartModule, Skeleton],
  template: `
    @let dataChart = displayData();
    @if (loading() && (!dataChart || dataChart.labels.length === 0)) {
      <p-skeleton width="100%" height="100%" />
    } @else if (dataChart) {
      @if (dataChart.labels.length > 0) {
        <p-chart height="100%" type="line" [data]="dataChart" [options]="options"/>
      } @else {
        <p class='w-full h-full grid place-items-center'>Rien à afficher</p>
      }
    } 
  `,
})
export class ExpenseAnnualStat implements OnInit {
  loading = input(false);
  data = input<AnnualTotal[]>()

  displayData = computed(() => {
    const d = this.data();
    return d ? buildAnnualChart(d) : undefined
  })

  hasData = false;
  options: any = {
    borderJoinStyle: 'round',
    borderWidth: 2,
    hoverBorderWidth: 2,
    radius: 4,
    hoverRadius: 5,
    tension: 0.4,
  }

  ngOnInit(): void {
    const docStyle = getComputedStyle(document.documentElement);
    this.options.borderColor = docStyle.getPropertyValue('--p-primary-color');
  }
}