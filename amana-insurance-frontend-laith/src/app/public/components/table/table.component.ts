import {
  Component, ElementRef,
  EventEmitter,
  HostListener, Injectable,
  Input,
  OnChanges, OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {Column} from "../../shared/column";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormControl, FormsModule} from "@angular/forms";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {HealthInsurance} from "../../models/health-insurance.model";
import {MatChipsModule} from "@angular/material/chips";
import {DataService} from "../../../core/services/data.service";
import {Role} from '../../enum/Role';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {StorageService} from "../../../core/services/storage.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Subject} from "rxjs";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {SelectionModel} from "@angular/cdk/collections";
import {MatCustomButtonComponent} from "../mat-custom-button/mat-custom-button.component";
import {Payment} from "../../models/payment.model";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {BottomSheetComponent} from "../bottom-sheet/bottom-sheet.component";
import {Insurance} from "../../models/insurance.model";
import {User} from "../../models/user.model";
import {Office} from "../../models/office.model";
import {BottomSheetData} from "../../shared/bottom-sheet-data";


@Injectable()
class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>;
  nextPageLabel: string = 'التالي';
  previousPageLabel: string = 'السابق';
  firstPageLabel: string = 'الصفحة الأولى';
  lastPageLabel: string = 'الصفحة الأخيرة';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return ` 1 - 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `${page + 1} - ${amountPages}`;
  }


  itemsPerPageLabel = "تتكون الصفحة من";
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSortModule, MatTableModule, MatMenuModule, MatIconModule, RouterLink, MatPaginatorModule, MatButtonModule, MatChipsModule, MatProgressSpinnerModule, MatCheckboxModule, MatTooltipModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: [{provide: MatPaginatorIntl, useValue: new MyCustomPaginatorIntl()}]
})
export class TableComponent<T> implements OnChanges, OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchInput') myInput!: ElementRef;
  @Input() url: string = "";
  @Input() insurance: boolean = false;
  @Input() addButton: { label: string, icon: string, disabled: boolean } = {
    label: '',
    icon: '',
    disabled: false
  };
  @Input() hidden: boolean = true;
  @Input() report: boolean = false;
  @Input() payment: boolean = false;
  @Output() deleteRowEvent = new EventEmitter<number>();
  @Output() deleteHealthInsuranceRowEvent = new EventEmitter<HealthInsurance>();
  @Output() printHealthInsuranceRowEvent = new EventEmitter<HealthInsurance>();
  @Output() uploadBillEvent = new EventEmitter<Payment>();
  @Output() acceptPaymentEvent = new EventEmitter<number>();
  @Output() rejectPaymentEvent = new EventEmitter<number>();
  @Output() printEvent = new EventEmitter<number>();
  @Output() searchEvent = new EventEmitter<string>();
  cant_access!: boolean
  searchKey: string = ''
  @Input() tableColumns: Array<Column> = [];
  @Input() tableData!: Array<T>;
  @Input() totalReport!: number
  displayedColumns: Array<String> = []
  dataSource: MatTableDataSource<T> = new MatTableDataSource();
  readonly Role = Role;
  @Input() waitPrinting: boolean = false
  numberOfRows = Math.floor(window.innerHeight / 120)
  selection = new SelectionModel<T>(true, []);
  @Input() bottomSheetManagement: 'normal' | 'healthInsurance' | 'payment' = 'normal'

  /** Whether the number of selected elements matches the total number of rows. */
  constructor(private _liveAnnouncer: LiveAnnouncer, protected dataService: DataService, private storageService: StorageService, private _bottomSheet: MatBottomSheet) {
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  openBottomSheet(elem: T): void {
    let bottomSheetData: BottomSheetData;
    this.bottomSheetManagement === 'normal' ?
      bottomSheetData = {
        management: 'normal',
        url: this.url,
        isInsurance:this.insurance,
        tableRow: elem as Insurance | User | Office,
        delete: () => this.delete((elem as Insurance | User | Office).id),
        print: () => this.print((elem as Insurance | User | Office).id)
      } : this.bottomSheetManagement === 'payment' ?
        bottomSheetData = {
          management: 'payment',
          url: this.url,
          isInsurance:this.insurance,
          tableRow: elem as Payment,
          delete: () => this.delete((elem as Payment).id),
          print: () => this.print((elem as Payment).id),
          uploadBill:()=>this.uploadBill(elem as Payment),
          acceptPayment:()=>this.acceptPayment((elem as Payment).id),
          rejectPayment:()=>this.rejectPayment((elem as Payment).id)
        }
        :
        bottomSheetData = {
          management: 'healthInsurance',
          url: this.url,
          isInsurance:this.insurance,
          tableRow: elem as HealthInsurance,
          deleteObject: () => this.deleteObject(elem as HealthInsurance),
          printObject: () => this.printObject(elem as HealthInsurance)
        }
    this._bottomSheet.open(BottomSheetComponent, {
      data: bottomSheetData
    })
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */

  /*checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }*/

  myClass(type: string): string {
    switch (type) {
      case 'صحي مجموعات':
        return 'group-health-insurance-chip'
      case 'صحي فرد':
        return 'person-health-insurance-chip'
      case 'مسافر':
        return 'travel-insurance-chip'
      case 'إجباري':
        return 'obligatory-insurance-chip'
      case 'طرف ثالث':
        return 'third-party-insurance-chip'
      case Role.Admin:
        return 'admin-role-chip'
      case Role.Director:
        return 'director-role-chip'
      case Role.User:
        return 'user-role-chip'
      case Role.Finance:
        return 'finance-role-chip'
      case 'قيد المراجعة':
        return 'pending-payment-chip'
      case 'مرفوض':
        return 'rejected-payment-chip'
      case 'تم الموافقة':
        return 'accepted-payment-chip'
      default:
        return ''

    }
  }

  ngOnInit() {
    this.cant_access = this.dataService.isAdmin && this.url !== 'offices' && this.url !== 'users'
    if (this.cant_access && this.tableColumns.findIndex((column) => column.columnDef === 'settings') !== -1) {
      this.tableColumns = this.tableColumns.filter((column) => column.columnDef !== 'settings')
    }
    //this.tableColumns=this.tableColumns.filter((column) => column.columnDef !== 'taxe1')
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.dataSource = new MatTableDataSource(this.tableData);
    //console.log(this.dataService.isDirector && this.url==='payments')
  }

  clickSearchIcon() {
    this.hidden = !this.hidden
    if (!this.hidden)
      this.myInput.nativeElement.focus()
  }


  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.numberOfRows = Math.floor(window.innerHeight / 120)
    this.paginator.pageSize = this.numberOfRows
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: any) {
    if (changes['tableData']) {

      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }


  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


  filter(key: string) {
    this.dataSource.filter = key;
  }

  search() {
    this.searchEvent.emit(this.searchKey)
  }

  delete(id: number) {
    this.deleteRowEvent.emit(id)
    this._bottomSheet.dismiss()
  }

  deleteObject(healthInsurance: HealthInsurance) {
    this.deleteHealthInsuranceRowEvent.emit(healthInsurance)
    this._bottomSheet.dismiss()
  }

  printObject(healthInsurance: HealthInsurance) {
    this.printHealthInsuranceRowEvent.emit(healthInsurance)
    this._bottomSheet.dismiss()
  }

  print(id: number) {
    this.printEvent.emit(id)
    this._bottomSheet.dismiss()
  }

  uploadBill(payment: Payment) {
    this.uploadBillEvent.emit(payment)
  }

  acceptPayment(id: number) {
    this.acceptPaymentEvent.emit(id)
    this._bottomSheet.dismiss()
  }

  rejectPayment(id: number) {
    this.rejectPaymentEvent.emit(id)
    this._bottomSheet.dismiss()
  }
}
