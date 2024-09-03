import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
//or
 
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  chart:any ;
  todayDate:any;
  afterDate:any;
  constructor() {
  
  }

  ngOnInit() {
    this.createChart();
  }

  createChart(){
  
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
								 '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
	       datasets: [
          {
            label: "قيمة المبيعات",
            data: ['467','576', '572', '79', '92',
								 '574', '573', '576'],
            backgroundColor: 'white',
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1


          },
      
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }
}
