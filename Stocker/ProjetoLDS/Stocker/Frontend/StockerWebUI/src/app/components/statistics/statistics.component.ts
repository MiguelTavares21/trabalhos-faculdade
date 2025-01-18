import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Chart, registerables, ChartType, ChartTypeRegistry } from 'chart.js';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../services/statistics.service';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../alert/alert.component';
import { Types } from '../../enums/types.enum';
import { TypeLabels } from '../../utils/typeLabels';
import { CategoryStats } from '../../models/Statistics/CategoryStats';
import { ProductStats } from '../../models/Statistics/ProductStats';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { Unity } from '../../enums/unity.enum';
import { ExpensesStats } from '../../models/Statistics/ExpensesStats';
import { color } from 'chart.js/helpers';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertComponent],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  today = new Date();
  currentYear = this.today.getFullYear();

  defaultStartDate = `${this.currentYear}-01-01`;

  formattedMonth = String(this.today.getMonth() + 1).padStart(2, '0');
  formattedDay = String(this.today.getDate()).padStart(2, '0');
  defaultEndDate = `${this.today.getFullYear()}-${this.formattedMonth}-${
    this.formattedDay
  }`;
  alerts: string[] = [];
  selectedGroupId = localStorage.getItem('selectedGroupId');
  consumptionChartData: any;
  consumptionLabelData: string[] = [];
  totalConsumptionConsumedData: number[] = [];
  categoryData: CategoryStats = {
    productType: '',
    totalSpent: 0,
    totalQuantity: 0,
    totalPurchases: 0,
    averageSpent: 0,
  };
  productData: ProductStats = {
    productId: 0,
    totalSpent: 0,
    totalQuantity: 0,
    totalPurchases: 0,
    averageSpentByProduct: 0,
  };
  expensesData: ExpensesStats = {
    totalSpent: 0,
    totalPurchases: 0,
    averageSpent: 0,
  };
  selectedConsumptionChart: string = 'piechart';
  consumptionChart: Chart | null = null;
  startDateConsumption = this.defaultStartDate;
  endDateConsumption = this.defaultEndDate;
  startDateCategory: string = this.defaultStartDate;
  endDateCategory: string = this.defaultEndDate;
  startDateProduct: string = this.defaultStartDate;
  endDateProduct: string = this.defaultEndDate;
  startDateTotalSpent: string = this.defaultStartDate;
  endDateTotalSpent: string = this.defaultEndDate;
  types = Types;
  typeLabels = TypeLabels;
  selectedType: string = 'Congelados';
  touchedType: boolean = false;
  products: Product[] = [];
  selectedProduct: Product = {
    id: 0,
    name: '',
    quantity: 0,
    unity: Unity.Gramas,
    order_Point: 0,
    ideal_Point: 0,
    type: Types.Animais,
    in_List: false,
    group_Id: 0,
  };

  @ViewChild('consumptionChartCanvas', { static: false })
  consumptionChartCanvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    private statsService: StatisticsService,
    private productsService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.defaultStartDate = `${this.currentYear}-01-01`;
    this.defaultEndDate = `${this.today.getFullYear()}-${this.formattedMonth}-${
      this.formattedDay
    }`;

    this.fetchExpensesStatsData();
    this.fetchTypeStatsData();
    this.fetchProductsByGroup();
  }

  ngAfterViewInit(): void {
    this.updateConsumptionChart();
    this.cdr.detectChanges();
  }

  fetchProductsByGroup(): void {
    this.productsService
      .getProductsByGroup(Number(this.selectedGroupId))
      .subscribe({
        next: (result) => {
          this.products = result;
        },
        error: (error) => {
          console.error('Erro ao listar os dados:', error);
        },
      });
  }

  fetchTypeStatsData(): void {
    const startDateFormatted = `${this.startDateCategory}T00:00:00`;
    const endDateFormatted = `${this.endDateCategory}T23:59:59`;

    this.statsService
      .getCategoryStats(
        Number(this.selectedGroupId),
        this.selectedType,
        startDateFormatted,
        endDateFormatted
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.categoryData = result;
            this.categoryData.productType = result.productType;
            this.categoryData.totalSpent = result.totalSpent;
            this.categoryData.totalQuantity = result.totalQuantity;
            this.categoryData.totalPurchases = result.totalPurchases;
            this.categoryData.averageSpent = result.averageSpent;
          } else {
            this.addAlert(
              'Sem dados disponíveis para o intervalo selecionado!'
            );
          }
        },
        error: (error) => {
          console.error('Erro ao listar os dados:', error);
          this.categoryData = {
            productType: '',
            totalSpent: 0,
            totalQuantity: 0,
            totalPurchases: 0,
            averageSpent: 0,
          };
        },
      });
  }

  fetchProductStatsData(): void {
    const startDateFormatted = `${this.startDateProduct}T00:00:00`;
    const endDateFormatted = `${this.endDateProduct}T23:59:59`;

    this.statsService
      .getProductStats(
        Number(this.selectedGroupId),
        this.selectedProduct.id,
        startDateFormatted,
        endDateFormatted
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.productData = result;
            this.productData.productId = result.productId;
            this.productData.totalSpent = result.totalSpent;
            this.productData.totalQuantity = result.totalQuantity;
            this.productData.totalPurchases = result.totalPurchases;
            this.productData.averageSpentByProduct =
              result.averageSpentByProduct;
          } else {
            this.addAlert(
              'Sem dados disponíveis para o intervalo selecionado!'
            );
          }
        },
        error: (error) => {
          console.error('Erro ao listar os dados:', error);
          this.productData = {
            productId: 0,
            totalSpent: 0,
            totalQuantity: 0,
            totalPurchases: 0,
            averageSpentByProduct: 0,
          };
        },
      });
  }

  fetchExpensesStatsData(): void{
    const startDateFormatted = `${this.startDateTotalSpent}T00:00:00`;
    const endDateFormatted = `${this.endDateTotalSpent}T23:59:59`;

    this.statsService
      .getExpensesStats(
        Number(this.selectedGroupId),
        startDateFormatted,
        endDateFormatted
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.expensesData = result;
            this.expensesData.totalSpent = result.totalSpent;
            this.expensesData.totalPurchases = result.totalPurchases;
            this.expensesData.totalSpent = result.totalSpent;
          } else {
            this.addAlert(
              'Sem dados disponíveis para o intervalo selecionado!'
            );
          }
        },
        error: (error) => {
          console.error('Erro ao listar os dados:', error);
          this.expensesData = {
            totalSpent: 0,
            totalPurchases: 0,
            averageSpent: 0,
          };
        },
      });
  }

  onTypeChange(): void {
    this.touchedType = true;
    this.fetchTypeStatsData();
  }

  updateConsumptionChart(): void {
    if (!this.consumptionChartCanvasRef) return;

    if (this.consumptionChart) {
      this.consumptionChart.destroy();
    }

    const startDateFormatted = `${this.startDateConsumption}T00:00:00`;
    const endDateFormatted = `${this.endDateConsumption}T23:59:59`;

    this.statsService
      .getConsumptionStats(
        Number(this.selectedGroupId),
        startDateFormatted,
        endDateFormatted
      )
      .subscribe({
        next: (result) => {
          if (result && result.length > 0) {
            this.consumptionChartData = result;
            this.consumptionLabelData = result.map(
              (item: any) => item.productName
            );
            this.totalConsumptionConsumedData = result.map(
              (item: any) => item.totalConsumed
            );
            this.createConsumptionChart();
          } else {
            this.addAlert(
              'Sem dados disponíveis para o intervalo selecionado!'
            );
          }
        },
        error: (error) => {
          console.error('Erro ao listar os dados:', error);
          this.addAlert(`${error.error.Error[0]}!`);
        },
      });
  }

  createConsumptionChart(): void {
    const chartType = this.getChartType(
      this.selectedConsumptionChart
    ) as ChartType;
    var options: any;

    if (
      chartType !== 'pie' &&
      chartType !== 'doughnut' &&
      chartType !== 'polarArea'
    ) {
      options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
            display: false,
            labels: {
              color: 'white',
              font: {
                size: 15,
              },
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.7)',
            titleColor: '#fff',
          },
        },
      };
    } else {
      options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'white',
              font: {
                size: 15,
              },
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.7)',
            titleColor: '#fff',
          },
        },
      };
    }

    if (
      chartType !== 'pie' &&
      chartType !== 'doughnut' &&
      chartType !== 'polarArea' &&
      chartType !== 'radar'
    ) {
      options.scales = {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: 'rgba(255, 255, 255, 0.5)',
          },
          ticks: {
            color: 'white',
          },
        },
        x: {
          grid: {
            display: true,
            color: 'rgba(255, 255, 255, 0.5)',
          },
          ticks: {
            color: 'white',
          },
        },
      };
    }

    if (chartType === 'radar') {
      options.scales = {
        r: {
          angleLines: {
            display: true,
            color: 'rgba(255, 255, 255, 1)',
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.5)',
          },
          ticks: {
            display: false,
          },
          pointLabels: {
            color: 'white',
            font: {
              size: 14,
              family: 'Arial, sans-serif',
            },
          },
        },
      };
    }


    const backgroundColors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(231, 76, 60, 0.6)',
      'rgba(46, 204, 113, 0.6)',
      'rgba(241, 196, 15, 0.6)',
      'rgba(52, 152, 219, 0.6)',
      'rgba(39, 174, 96, 0.6)',
      'rgba(142, 68, 173, 0.6)',
      'rgba(244, 67, 54, 0.6)',
      'rgba(52, 152, 219, 0.6)',
      'rgba(155, 89, 182, 0.6)',
      'rgba(26, 188, 156, 0.6)',
      'rgba(230, 126, 34, 0.6)',
      'rgba(255, 87, 34, 0.6)',
      'rgba(0, 188, 212, 0.6)',
    ];

    const dataset = {
      label: 'Quantidades Consumidas',
      data: this.totalConsumptionConsumedData,
      borderWidth:
        chartType === 'pie' ||
        chartType === 'doughnut' ||
        chartType === 'polarArea' ||
        chartType === 'radar'
          ? 0
          : 1,
      backgroundColor: backgroundColors.slice(
        0,
        this.totalConsumptionConsumedData.length
      ),
    };

    this.consumptionChart = new Chart(
      this.consumptionChartCanvasRef.nativeElement,
      {
        type: chartType,
        data: {
          labels: this.consumptionLabelData,
          datasets: [dataset],
        },
        options: options,
      }
    );
  }

  getChartType(chartId: string): keyof ChartTypeRegistry {
    const chartTypes: { [key: string]: keyof ChartTypeRegistry } = {
      barchart: 'bar',
      piechart: 'pie',
      doughnutchart: 'doughnut',
      polarchart: 'polarArea',
      radarchart: 'radar',
      linechart: 'line',
    };
    return chartTypes[chartId] || 'bar';
  }

  addAlert(message: string) {
    if (!this.alerts.includes(message)) {
      this.alerts.push(message);
    }
    setTimeout(() => {
      this.removeAlert(message);
    }, 2000);
  }

  removeAlert(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert);
  }
}
