import {Component} from '@angular/core';
import {PersonHealthInsuranceService} from "../../../../core/services/person-health-insurance.service";
import {GroupHealthInsuranceService} from "../../../../core/services/group-health-insurance.service";
import {Role} from 'src/app/public/enum/Role';
import {StorageService} from "../../../../core/services/storage.service";
import {HealthInsurance} from "../../../../public/models/health-insurance.model";
import {TablesHelper} from "../../../../public/helpers/TablesHelper";
import {Router} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Column} from "../../../../public/shared/column";
import {DialogComponent} from "../../../../public/components/dialog/dialog.component";
import moment from "moment";

@Component({
  selector: 'app-health-insurances-tab',
  templateUrl: './health-insurances-tab.component.html',
  styleUrls: ['./health-insurances-tab.component.scss']
})
export class HealthInsurancesTabComponent {
  constructor(private personHealthInsuranceService: PersonHealthInsuranceService, private groupHealthInsuranceService: GroupHealthInsuranceService, private router: Router, private tokenStorageService: StorageService, private dialog: MatDialog) {
  }

  healthInsurances: Array<HealthInsurance> = [];
  protected readonly Role = Role
  protected actualUser = this.tokenStorageService.getUser()
  waitPrinting: boolean = false
  addButton = {
    label: 'إضافة تأمين صحي',
    icon: 'add_moderator',
    disabled:false
  }

  tableColumns: Array<Column> = [
    {
      columnDef: 'id',
      header: 'No.',
      cell: (element: Record<string, number | string>) => `${this.healthInsurances.findIndex((ins) => ins.id === element['id'] && ins.type === element['type']) + 1}`
    },
    {columnDef: 'name', header: 'إسم المأمن', cell: (element: Record<string, string>) => `${element['name']}`},
    {columnDef: 'phone', header: 'رقم الهاتف', cell: (element: Record<string, number>) => `${element['phone']}`},
    {columnDef: 'endDate', header: 'تاريخ الإنتهاء', cell: (element: Record<string, Date>) => `${moment(element['endDate']).format('LL')}`},
    {columnDef: 'type', header: 'نوعية التأمين', cell: (element: Record<string, String>) => `${element['type']}`},
    {columnDef: 'total', header: 'المبلغ الإجمالي', cell: (element: Record<string, number>) => `${element['total']}`},
    {columnDef: 'settings', header: '', cell: (element: Record<string, any>) => `${element['settings']}`},
  ];

  fetchHealthInsurances() {
    if (this.actualUser.role == Role.User) {
      this.personHealthInsuranceService.getPersonHealthInsurancesByUser(this.actualUser.id).subscribe({
        next: (Response1) => {
          this.groupHealthInsuranceService.getGroupHealthInsurancesByUser(this.actualUser.id).subscribe({
            next: (Response2) => {
              this.healthInsurances = []
              this.healthInsurances.push(...Response1, ...Response2);
              TablesHelper.sortTable(this.healthInsurances)
            }, error: (err) => {
              console.log("eroor is ", err)
            }
          })
        }, error: (err) => {
          console.log("eroor is ", err)
        }
      })
    } else if (this.actualUser.role == Role.Director) {
      this.personHealthInsuranceService.getPersonHealthInsurancesByOffice(this.actualUser.bureauId).subscribe({
        next: (Response1) => {
          this.groupHealthInsuranceService.getGroupHealthInsurancesByOffice(this.actualUser.bureauId).subscribe({
            next: (Response2) => {
              this.healthInsurances = []
              this.healthInsurances.push(...Response1, ...Response2);
              TablesHelper.sortTable(this.healthInsurances)
            }, error: (err) => {
              console.log("eroor is ", err)
            }
          })
        }, error: (err) => {
          console.log("eroor is ", err)
        }
      })
    } else {
      //this.healthInsurances = [];
      this.personHealthInsuranceService.getPersonHealthInsurances().subscribe({
        next: (Response1) => {
          this.groupHealthInsuranceService.getGroupHealthInsurances().subscribe({
            next: (Response2) => {
              this.healthInsurances = []
              this.healthInsurances.push(...Response1, ...Response2);
              TablesHelper.sortTable(this.healthInsurances)
            }, error: (err) => {
              console.log("eroor is ", err)
            }
          })
        }, error: (err) => {
          console.log("eroor is ", err)
        }
      })
    }
  }

  search(searchKey: string) {
    if (searchKey != "") {
      this.personHealthInsuranceService.SearchPersonHealthInsurances(searchKey).subscribe((Response) => {
          this.groupHealthInsuranceService.SearchGroupHealthInsurance(searchKey).subscribe((Response2) => {
            this.healthInsurances = [];
            this.healthInsurances.push(...Response, ...Response2);
            TablesHelper.sortTable(this.healthInsurances)
          })
        }
        , (error) => {
          console.log("error is ", error)
        }
      );

    } else {
      this.fetchHealthInsurances()
    }
  }

  ngOnInit() {
    this.fetchHealthInsurances();
  }

  onDelete(healthInsurance: HealthInsurance) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "تأمين الصحي",
        content: "هل تريد حذف هذا التأمين الصحي ؟",
        isLoading: false,
        onSubmit: () => this.deleteRow(healthInsurance, dialogRef)
      }, autoFocus: false, panelClass: 'choice-dialog-container'
    });

  }

  deleteRow(healthInsurance: HealthInsurance, dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef.componentInstance.data.isLoading = true
    if (healthInsurance.type === 'صحي فرد') {
      this.personHealthInsuranceService.DeletePersonHealthInsurance(healthInsurance.id).subscribe({
          next: (Response) => {
            dialogRef.componentInstance.data.isLoading = false
            dialogRef.close()
            this.fetchHealthInsurances()
          }, error: err => {
            console.log("eroor is ", err)
          }
        }
      )
    } else {
      this.groupHealthInsuranceService.DeleteGroupHealthInsurance(healthInsurance.id).subscribe({
          next: (Response) => {
            dialogRef.componentInstance.data.isLoading = false
            dialogRef.close()
            this.fetchHealthInsurances()
          }, error: err => {
            console.log("eroor is ", err)
          }
        }
      )
    }
  }

  generatePDF(insurance: HealthInsurance) {
    this.waitPrinting = true
    if (insurance.type === 'صحي فرد') {
      this.personHealthInsuranceService.PDFPersonHealthInsurance(insurance.id).subscribe({
          next: (Response) => {
            this.waitPrinting = false
            const blob = new Blob([Response], {type: 'application/pdf'});
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL, '_blank');
          }, error: err => {
            this.waitPrinting = false
            console.log("eroor is ", err)
          }
        }
      )
    } else {

      this.groupHealthInsuranceService.PDFGroupHealthInsurance(insurance.id).subscribe({
          next: (Response) => {
            this.waitPrinting = false
            const blob = new Blob([Response], {type: 'application/pdf'});
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL, '_blank');
          }, error: err => {
            this.waitPrinting = false
            console.log("eroor is ", err)
          }
        }
      )
    }
  }

}
