import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatListModule} from "@angular/material/list";
import {MatLineModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatBadgeModule} from "@angular/material/badge";
import {HealthInsurance} from "../../models/health-insurance.model";
import {Payment} from "../../models/payment.model";
import {Router, RouterLink} from "@angular/router";
import {Insurance} from "../../models/insurance.model";
import {User} from "../../models/user.model";
import {Office} from "../../models/office.model";
import {BottomSheetData} from "../../shared/bottom-sheet-data";
import {DataService} from "../../../core/services/data.service";

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [CommonModule, MatListModule, MatLineModule, MatIconModule, MatInputModule, MatButtonModule, MatBadgeModule, RouterLink],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss'
})
export class BottomSheetComponent<T> {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: BottomSheetData,private _bottomSheetRef:MatBottomSheetRef<BottomSheetComponent<T>>,protected dataService:DataService) {}

  close() {
    this._bottomSheetRef.dismiss();
  }

}
