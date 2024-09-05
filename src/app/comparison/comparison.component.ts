import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ComparisonResult, ComparisonService } from "./comparison.service";
import { Chart, registerables } from "chart.js";
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    HttpClientModule
  ],
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss']
})
export class ComparisonComponent implements AfterViewInit {
  @ViewChild('comparisonChart', { static: false }) comparisonChartRef!: ElementRef<HTMLCanvasElement>;
  sizesInput: string = '';
  numSamples: number = 0;
  comparisonResult: ComparisonResult | null = null;
  chart: any;

  constructor(private comparisonService: ComparisonService, private cdRef: ChangeDetectorRef) {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    if (this.comparisonResult) {
      this.createChart(
        this.comparisonResult.sizes,
        this.comparisonResult.timesRecMemo,
        this.comparisonResult.timesIter
      );
    }
  }

  onSubmit() {
    const sizes = this.sizesInput.split(',').map(Number);
    const request = {
      sizes: sizes,
      numSamples: this.numSamples
    };

    this.comparisonService.compareAlgorithms(request).subscribe(result => {
      this.comparisonResult = result;
      this.cdRef.detectChanges();
      if (this.comparisonChartRef) {
        this.createChart(result.sizes, result.timesRecMemo, result.timesIter);
      }
    });
  }

  createChart(labels: number[], dataRecMemo: number[], dataIter: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    const canvas = this.comparisonChartRef?.nativeElement;
    if (!canvas) {
      console.error('Canvas element is not available');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.map(size => size.toString()),
        datasets: [
          {
            label: 'Recursive with Memoization',
            data: dataRecMemo,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
          },
          {
            label: 'Iterative',
            data: dataIter,
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Input Size'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Average Execution Time (ms)'
            }
          }
        }
      }
    });
  }
}
