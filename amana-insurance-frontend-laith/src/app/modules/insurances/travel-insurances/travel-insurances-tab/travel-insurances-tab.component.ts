import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {TravelInsuranceService} from "../../../../core/services/travel-insurance.service";
import {Role} from "../../../../public/enum/Role";
import {StorageService} from "../../../../core/services/storage.service";
import {Column} from "../../../../public/shared/column";
import {DialogComponent} from "../../../../public/components/dialog/dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TravelInsurance} from "../../../../public/models/travel-insurance.model";
import moment from "moment";

@Component({
  selector: 'app-travel-insurances-tab',
  templateUrl: './travel-insurances-tab.component.html',
  styleUrls: ['./travel-insurances-tab.component.scss']
})
export class TravelInsurancesTabComponent {
  constructor(private travelInsuranceService: TravelInsuranceService, private router: Router, private tokenStorageService: StorageService, private dialog: MatDialog) {
  }

  travelInsurances: Array<TravelInsurance> = [];
  protected readonly Role = Role
  protected actualUser = this.tokenStorageService.getUser()
  waitPrinting: boolean = false
  addButton = {
    label: 'إضافة تأمين للمسافرين',
    icon: 'add_moderator',
    disabled:false
  }
  tableColumns: Array<Column> = [
    {
      columnDef: 'id',
      header: 'No.',
      cell: (element: Record<string, number>) => `${this.travelInsurances.findIndex((trv) => trv.id === element['id']) + 1}`
    },
    {columnDef: 'name', header: 'إسم المأمن', cell: (element: Record<string, string>) => `${element['name']}`},
    {columnDef: 'phone', header: 'رقم الهاتف', cell: (element: Record<string, number>) => `${element['phone']}`},
    {columnDef: 'endDate', header: 'تاريخ الإنتهاء', cell: (element: Record<string, Date>) => `${moment(element['endDate'])/*.locale('en')*/.format('LL')}`},
    {columnDef: 'total', header: 'المبلغ الإجمالي', cell: (element: Record<string, number>) => `${element['total']}`},
    {columnDef: 'settings', header: '', cell: (element: Record<string, any>) => `${element['settings']}`},
  ];

  fetchTravels() {
    if (this.actualUser.role == Role.User) {
      this.travelInsuranceService.getTravelInsurancesByUser(this.actualUser.id).subscribe({
          next: (Response) => {
            this.travelInsurances = Response;
          }
          , error: (err) => {
            console.log("eroor is ", err)
          }
        }
      );
    } else if (this.actualUser.role == Role.Director) {
      this.travelInsuranceService.getTravelInsurancesByOffice(this.actualUser.bureauId).subscribe({
          next: (Response) => {
            this.travelInsurances = Response;
          }
          , error: (err) => {
            console.log("eroor is ", err)
          }
        }
      );
    } else {
      this.travelInsuranceService.getTravelInsurances().subscribe({
          next: (Response) => {
            this.travelInsurances = Response;
          }
          , error: (err) => {
            console.log("eroor is ", err)
          }
        }
      );
    }
  }

  search(searchKey: string) {
    //console.log(this.query)
    if (searchKey != "") {
      this.travelInsuranceService.SearchTravelInsurances(searchKey).subscribe({
          next: (Response) => {
            this.travelInsurances = Response;
          }
          , error: (err) => {
            console.log("eroor is ", err)
          }
        }
      );
    } else {
      this.fetchTravels()
    }
  }

  ngOnInit() {
    this.fetchTravels();
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "تأمين المسافرين",
        content: "هل تريد حذف هذا التأمين الخاص بالمسافرين ؟",
        isLoading: false,
        onSubmit: () => this.deleteRow(id, dialogRef)
      }, autoFocus: false, panelClass: 'choice-dialog-container'
    });
  }

  deleteRow(id: number, dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef.componentInstance.data.isLoading = true
    this.travelInsuranceService.DeleteTravelInsurance(id).subscribe({
        next: (Response) => {
          dialogRef._containerInstance._config.data.isLoading = false
          dialogRef.close()
          this.fetchTravels()
        }
        , error: (err) => {
          dialogRef._containerInstance._config.data.isLoading = false
          dialogRef.close()
          console.log("eroor is ", err)
        }
      }
    )

  }


  generatePDF(id: number) {
    this.waitPrinting = true
    this.travelInsuranceService.PDFTravelInsurance(id).subscribe({
        next: (Response) => {
          this.waitPrinting = false
          const blob = new Blob([Response], {type: 'application/pdf'});
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
        }, error: err => {
          this.waitPrinting = false
          console.log("error is ", err)
        }
      }
    )
  }
}
