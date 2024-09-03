import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ObligatoryInsuranceService} from "../../../../core/services/obligatory-insurance.service";
import {Role} from "../../../../public/enum/Role";
import {StorageService} from "../../../../core/services/storage.service";
import {Column} from "../../../../public/shared/column";
import {DialogComponent} from "../../../../public/components/dialog/dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ObligatoryInsurance} from "../../../../public/models/obligatory-insurance.model";
import moment from "moment";

@Component({
    selector: 'app-obligatory-insurances-tab',
    templateUrl: './obligatory-insurances-tab.component.html',
    styleUrls: ['./obligatory-insurances-tab.component.scss']
})
export class ObligatoryInsurancesTabComponent implements OnInit {
    constructor(private obligatoryInsuranceService: ObligatoryInsuranceService, private router: Router, private tokenStorageService: StorageService, private dialog: MatDialog) {
    }

    obligatoryInsurances: Array<ObligatoryInsurance> = [];
    protected readonly Role = Role
    waitPrinting=false
    protected actualUser = this.tokenStorageService.getUser()
    addButton = {
        label: 'إضافة تأمين إجباري',
        icon: 'add_moderator',
        disabled:false
    }

    tableColumns: Array<Column> = [
        {columnDef: 'id', header: 'No.', cell: (element: Record<string, number>) => `${this.obligatoryInsurances.findIndex((obg) => obg.id === element['id']) + 1}`},
        {columnDef: 'name', header: 'إسم المأمن', cell: (element: Record<string, string>) => `${element['name']}`},
        {columnDef: 'phone', header: 'رقم الهاتف', cell: (element: Record<string, number>) => `${element['phone']}`},
        {columnDef: 'endDate', header: 'تاريخ الإنتهاء', cell: (element: Record<string, Date>) => `${moment(element['endDate']).format('LL')}`},
        {columnDef: 'total', header: 'المبلغ الإجمالي', cell: (element: Record<string, number>) => `${element['total']}`},
        {columnDef: 'settings', header: '', cell: (element: Record<string, any>) => `${element['settings']}`},
    ];


    fetchObligs() {
        if (this.actualUser.role == Role.User) {
            this.obligatoryInsuranceService.getObligatoryInsurancesByUser(this.actualUser.id).subscribe({
                    next: (Response) => {
                        this.obligatoryInsurances = Response;
                    }
                    , error: (err) => {
                        console.log("eroor is ", err)
                    }
                }
            );
        } else if (this.actualUser.role == Role.Director) {
            this.obligatoryInsuranceService.getObligatoryInsurancesByOffice(this.actualUser.bureauId).subscribe({
                    next: (Response) => {
                        this.obligatoryInsurances = Response;
                    }
                    , error: (err) => {
                        console.log("eroor is ", err)
                    }
                }
            );
        } else {
            this.obligatoryInsuranceService.getObligatoryInsurances().subscribe({
                    next: (Response) => {
                        this.obligatoryInsurances = Response;
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
            this.obligatoryInsuranceService.SearchObligatoryInsurance(searchKey).subscribe({
                    next: (Response) => {
                        this.obligatoryInsurances = Response;
                    }
                    , error: (err) => {
                        console.log("eroor is ", err)
                    }
                }
            );
        } else {
            this.fetchObligs()
        }
    }

    ngOnInit() {
        this.fetchObligs();
    }

    onDelete(id: number) {
        const dialogRef = this.dialog.open(DialogComponent, {
            data: {
                title: "تأمين إجباري",
                content: "هل تريد حذف هذا التأمين الإجباري ؟",
                isLoading: false,
                onSubmit: () => this.deleteRow(id, dialogRef)
            }, autoFocus: false, panelClass: 'choice-dialog-container'
        });

    }

    deleteRow(id: number, dialogRef: MatDialogRef<DialogComponent>) {
        dialogRef.componentInstance.data.isLoading = true
        this.obligatoryInsuranceService.DeleteObligatoryInsurance(id).subscribe({
                next: (Response) => {
                    dialogRef.componentInstance.data.isLoading = false
                    dialogRef.close()
                    this.fetchObligs()
                }
                , error: (err) => {
                    dialogRef.componentInstance.data.isLoading = false
                    dialogRef.close()
                    console.log("eroor is ", err)
                }
            }
        )

    }

  generatePDF(id: number) {
    this.waitPrinting= true
    this.obligatoryInsuranceService.PDFObligatoryInsurance(id).subscribe({
        next: Response => {
          this.waitPrinting= false
          const blob = new Blob([Response], {type: 'application/pdf'});
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
        }, error: err => {
          this.waitPrinting= false
          console.log("error is ", err)
        }
      }
    )
  }


}
