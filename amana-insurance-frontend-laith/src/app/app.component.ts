import {Component, OnInit} from '@angular/core';
import moment from "moment/moment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor() {
  }

  defineLocale() {
    moment.defineLocale('ar-tn', {
      parentLocale: 'ar-tn',
      preparse: (string:string) => {
        return string;
      },
      postformat: (string:string) =>{
        return string;
      }
    });
  }
  ngOnInit(): void {
    this.defineLocale();
  }
  title = 'أمانة للتأمين';
}
