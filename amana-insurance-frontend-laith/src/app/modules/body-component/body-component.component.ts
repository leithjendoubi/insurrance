import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-body',
  templateUrl: './body-component.component.html',
  styleUrl: './body-component.component.scss'
})
export class BodyComponentComponent {

  @Input() collapsed =false
  @Input() screenWidth=0
  getBodyClass():string{
    let styleClass = ''
    if(this.collapsed && this.screenWidth>768){
      styleClass='body-trimmed'
    }
    if(this.collapsed && this.screenWidth<=768 && this.screenWidth>0){
      styleClass='body-md-screen'
    }
    return styleClass
  }
}
