import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'mat-custom-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './mat-custom-button.component.html',
  styleUrl: './mat-custom-button.component.scss'
})
export class MatCustomButtonComponent {

  @Input() label!: string ;
  @Input() type!: string;
  @Input() color!: string;
  @Input() isLoading!: boolean;
  @Input() classlist!:string
  @Input() icon!: string
  @Input() disabled: boolean=false;
  constructor() {
  }
}
