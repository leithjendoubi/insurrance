import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/public/enum/Role';
import {Chart, ChartConfiguration, ChartItem, registerables} from 'node_modules/chart.js'

@Component({
  selector: 'app-mychart',
  templateUrl: './mychart.component.html',
  styleUrls: ['./mychart.component.css']
})
export class MychartComponent  implements OnInit{
  chart: any = [];
  bureau:any;
  user_name:any
    //user:any="موظف"
    protected readonly Role = Role;
    //user:any="مالي"
    user:any="مدير مكتب"
  constructor() {}

  ngOnInit() {
    this.createChart()
  }
  createChart(): void {
 
  
      this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
      
          labels: ['إجباري', ' طرف ثالث','مسافرين',' تأمين صحي ' ],
          
          datasets: [
            {
              label: 'المرابيح',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }  
  }


