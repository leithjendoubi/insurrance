import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";

import {MyForm} from "../../shared/my-form";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatCustomButtonComponent} from "../mat-custom-button/mat-custom-button.component";
import {Router, RouterLink} from "@angular/router";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {MatButtonModule} from "@angular/material/button";
import {TableComponent} from "../table/table.component";
import {Column} from "../../shared/column";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../dialog/dialog.component";
import * as XLSX from 'xlsx';
import {StorageService} from "../../../core/services/storage.service";
import {Role} from "../../enum/Role";
import {state} from "@angular/animations";
import {Insurance} from "../../models/insurance.model";

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-form',
  standalone: true,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  imports: [CommonModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatCustomButtonComponent, RouterLink, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, TableComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent<T> implements OnInit{

  @Input() myForm!: MyForm
  @Input() return_link!: string
  @Input() updateForm = false
  @Input() addForm = false
  @Input() report: boolean = false
  @Output() onSubmitEvent = new EventEmitter<FormGroup>();
  @Output() handleFileInputChangeEvent = new EventEmitter<FileList | null>();
  @Input() tableColumns: Array<Column> = [];
  showedColumns: Array<Column> = [];
  @Input() tableData!: Array<T>;
  @Input() showTable!: number
  @Input() totalReport!: number
  @Input() isLoadingSearch!: boolean
  @ViewChild('Table') table!: ElementRef;
  @Input() submitButtonDisabled: boolean=false
  @Input() XLSXFilename!: string
  startDate: Date = new Date()

  constructor(private dialog: MatDialog, private storageService: StorageService, private router: Router) {
  }

  ngOnInit(): void {
    this.showedColumns = this.tableColumns.filter((column) => column.columnDef !=='initial' && column.columnDef !== 'taxe1' && column.columnDef !=='taxe2' && column.columnDef !=='taxe3' && column.columnDef !=='taxe4')
  }

  onSubmit() {
    this.onSubmitEvent.emit(this.myForm.formGroup)
  }

  handleFileInputChange(l: FileList | null): void {
    this.handleFileInputChangeEvent.emit(l)
  }


  exportExcel() {
    if (this.tableData.length > 0) {
      //let data = document.querySelector('table');
      let headers=this.tableColumns.map((column) => column.header)
      let data:any[]=[];
      this.tableData.forEach((elem)=> data.push(this.tableColumns.map((column) => column.cell(elem))))
      let result =[headers]
      data.map((row)=>{result.push(row)})
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(result);

      /*let data = document.querySelector('table');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);*/
      for (let i = 0; i < this.tableColumns.length; i++) {
        ws['!cols']?.push({width: 50})
      }
      ws["A1"].s = {
        width: 50,
        /*fill:{
          patternType:"solid",
          fgColor:{ rgb: "00dce6f1" },
          bgColor:{ rgb: "00dce6f1" }
        }*/
      }
      console.log(ws)
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, this.XLSXFilename + new Date().getTime() + '.xlsx');
    } else {
      this.dialog.open(DialogComponent, {
        data: {
          type: 'info',
          title: this.myForm.title,
          content: 'لا يوجد بيانات للطباعة'
        }
      })
    }
  }

  /*goToPayment(){
    if(this.tableData.length > 0){
      this.router.navigate(['/dashboard/payment/demand'])
    }
    else{
      this.dialog.open(DialogComponent, {
        data: {
          type: 'info',
          title: this.myForm.title,
          content: 'لا يوجد بيانات للإستخلاص'
        }
      })
    }
  }

  protected readonly Role = Role;*/
}
