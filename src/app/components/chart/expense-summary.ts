import { Component, computed, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Skeleton } from 'primeng/skeleton';
import { buildSummaryByCategory } from '../../utils/chart.utility';

@Component({
  selector: 'app-expense-summary',
  imports: [ChartModule, Skeleton],
  template: `
    @let array = displayData();
    @if (loading() && (!array || array.labels.length === 0)) {
      <div class="flex items-center gap-3 h-full">
        <div class="w-1/2">
          <p-skeleton width="85%" height="20px" />
          <p-skeleton class="mt-2 block" width="90%" height="20px" />
          <p-skeleton class="mt-2 block" width="85%" height="20px" />
          <p-skeleton class="mt-2 block" width="80%" height="20px" />
          <p-skeleton class="mt-2 block" width="75%" height="20px" />
          <p-skeleton class="mt-2 block" width="60%" height="20px" />
          <p-skeleton class="mt-2 block" width="55%" height="20px" />
        </div>
        <p-skeleton borderRadius="100%" width="10rem"  height="10rem" class="mx-auto" />
      </div>
    } @else if (array) {
      @if (array.labels.length > 0) {
        <p-chart
          height="100%"
          type="doughnut"
          [data]="array"
          [options]="options"
        />
      } @else {
        <p class="w-full h-full grid place-items-center">Rien à afficher</p>
      }
    }
  `,
})
export class ExpenseSummary {
  loading = input(false);
  data = input<{ category: string; total: number }[]>();

  displayData = computed(() => {
    const d = this.data();
    return d ? buildSummaryByCategory(d) : undefined;
  });

  hasData = false;
  options = {
    plugins: {
      legend: {
        align: 'start',
        position: 'left',
        labels: {
          generateLabels: this.getLabel,
        },
      },
    },
  };

  private getLabel(chart: any) {
    const data = chart.data;
    if (data.labels.length && data.datasets.length) {
      const dataset = data.datasets[0];
      return data.labels.map((label: string, index: number) => {
        const isHidden = chart.getDataVisibility(index) === false;
        return {
          index,
          text: `${label}: ${Intl.NumberFormat('fr-FR', { style: 'decimal' }).format(dataset.data[index])}Ar`,
          fillStyle: dataset.backgroundColor[index],
          strokeStyle: dataset.backgroundColor[index],
          lineWidth: 1,
          hidden: isHidden,
        };
      });
    }
    return [];
  }
}
