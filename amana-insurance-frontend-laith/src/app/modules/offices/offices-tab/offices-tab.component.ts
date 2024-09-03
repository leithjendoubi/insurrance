import {Component} from '@angular/core';
import {OfficeService} from "../../../core/services/office.service";
import {Office} from "../../../public/models/office.model";
import {Column} from "../../../public/shared/column";
import {DialogComponent} from "../../../public/components/dialog/dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-offices-tab',
  templateUrl: './offices-tab.component.html',
  styleUrls: ['./offices-tab.component.scss']
})
export class OfficesTabComponent/* implements OnChanges*/ {

  tableColumns: Array<Column> = [
    /*{columnDef:'select', header: 'select', cell: (element: Record<string, any>) => `${element['select']}`},*/
    {
      columnDef: 'id',
      header: 'No.',
      cell: (element: Record<string, number>) => `${this.offices.findIndex((bur) => bur.id === element['id']) + 1}`
    },
    {columnDef: 'name', header: 'إسم المكتب', cell: (element: Record<string, string>) => `${element['name']}`},
    {columnDef: 'phone', header: 'رقم الهاتف', cell: (element: Record<string, number>) => `${element['phone']}`},
    {columnDef: 'address', header: 'العنوان', cell: (element: Record<string, string>) => `${element['address']}`},
    {columnDef: 'settings', header: '', cell: (element: Record<string, any>) => `${element['settings']}`},
  ];
  addButton = {
    label: 'إضافة مكتب',
    icon: 'add_home_work',
    disabled: false
  }
  offices: Array<Office> = [];

  constructor(private officeService: OfficeService, private dialog: MatDialog /*private router: Router,private _liveAnnouncer: LiveAnnouncer*/) {

  }


  fetchOffices() {
    this.officeService.getOffices().subscribe({
        next: (Response) => {
          this.offices = Response;
        }, error: err => {
          console.log("error is ", err)
        }
      }
    );
  }

  ngOnInit(): void {
    this.fetchOffices()
  }

  search(searchKey: string) {
    if (searchKey != "") {
      this.officeService.SearchOffices(searchKey).subscribe({
          next: (Response) => {
            //this.offices=[]
            this.offices = Response;
          }, error: err => {
            console.log("error is ", err)
          }
        }
      )
      ;
    } else {
      this.fetchOffices()
    }
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "المكاتب",
        content: "هل تريد حذف هذا المكتب ؟",
        isLoading: false,
        onSubmit: () => this.deleteRow(id, dialogRef)
      }, autoFocus: false, panelClass: 'choice-dialog-container'
    });
  }

  deleteRow(id: number, dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef.componentInstance.data.isLoading = true
    this.officeService.DeletOffice(id).subscribe({
        next: () => {
          dialogRef.componentInstance.data.isLoading = false
          dialogRef.close()
          this.fetchOffices()
        }, error: error => {
          dialogRef.componentInstance.data.isLoading = false
          dialogRef.close()
          console.log("error is ", error)
        }
      }
    )
  }
}
