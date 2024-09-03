import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from "../../../../core/services/storage.service";
import {Role} from 'src/app/public/enum/Role';
import {TravelInsuranceService} from "../../../../core/services/travel-insurance.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Column} from "../../../../public/shared/column";
import {DialogComponent} from "../../../../public/components/dialog/dialog.component";
import {ThirdPartyInsurance} from "../../../../public/models/third-party-insurance.model";
import {ThirdPartyInsuranceService} from "../../../../core/services/third-party-insurance.service";
import moment from "moment";

@Component({
  selector: 'app-third-party-insurances-tab',
  templateUrl: './third-party-insurances-tab.component.html',
  styleUrls: ['./third-party-insurances-tab.component.scss']
})
export class ThirdPartyInsurancesTabComponent implements OnInit {


  constructor(private thirdPartyInsuranceService: ThirdPartyInsuranceService, private router: Router, private tokenStorageService: StorageService, private dialog: MatDialog) {
  }

  thirdPartyInsurances: Array<ThirdPartyInsurance> = [];
  protected readonly Role = Role
  protected actualUser = this.tokenStorageService.getUser()
  waitPrinting:boolean=false
  addButton = {
    label: 'إضافة تأمين طرف ثالث',
    icon: 'add_moderator',
    disabled:false
  }
  tableColumns: Array<Column> = [
    {
      columnDef: 'id',
      header: 'No.',
      cell: (element: Record<string, number>) => `${this.thirdPartyInsurances.findIndex((tpi) => tpi.id === element['id']) + 1}`
    },
    {columnDef: 'name', header: 'إسم المأمن', cell: (element: Record<string, string>) => `${element['name']}`},
    {columnDef: 'phone', header: 'رقم الهاتف', cell: (element: Record<string, number>) => `${element['phone']}`},
    {columnDef: 'endDate', header: 'تاريخ الإنتهاء', cell: (element: Record<string, Date>) => `${moment(element['endDate']).format('LL')}`},
    {columnDef: 'total', header: 'المبلغ الإجمالي', cell: (element: Record<string, number>) => `${element['total']}`},
    {columnDef: 'settings', header: '', cell: (element: Record<string, any>) => `${element['settings']}`},
  ];

  fetchThirdPartyInsurances() {
    if (this.actualUser.role == Role.User) {
      this.thirdPartyInsuranceService.getThirdPartyInsurancesByUser(this.actualUser.id).subscribe({
          next: (Response) => {
            this.thirdPartyInsurances = Response;
          }
          , error: (err) => {
            console.log("error is ", err)
          }
        }
      );
    } else if (this.actualUser.role == Role.Director) {
      this.thirdPartyInsuranceService.getThirdPartyInsurancesByOffice(this.actualUser.bureauId).subscribe({
          next: (Response) => {
            this.thirdPartyInsurances = Response;
          }
          , error: (err) => {
            console.log("error is ", err)
          }
        }
      );
    } else {
      this.thirdPartyInsuranceService.getThirdPartyInsurances().subscribe({
          next: (Response) => {
            this.thirdPartyInsurances = Response;
          }
          , error: (err) => {
            console.log("error is ", err)
          }
        }
      );
    }
  }

  search(searchKey: string) {
    //console.log(this.query)
    if (searchKey != "") {
      this.thirdPartyInsuranceService.SearchThirdPartyInsurances(searchKey).subscribe({
          next: (Response) => {
            this.thirdPartyInsurances = Response;
          }
          , error: (err) => {
            console.log("error is ", err)
          }
        }
      );
    } else {
      this.fetchThirdPartyInsurances()
    }
  }

  ngOnInit() {
    this.fetchThirdPartyInsurances();
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "تأمين طرف ثالث",
        content: "هل تريد حذف هذا التأمين الخاص بالطرف الثالث ؟",
        isLoading: false,
        onSubmit: () => this.deleteRow(id, dialogRef)
      }, autoFocus: false, panelClass: 'choice-dialog-container'
    });
  }

  deleteRow(id: number, dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef.componentInstance.data.isLoading = true
    this.thirdPartyInsuranceService.DeleteThirdPartyInsurance(id).subscribe({
        next: (Response) => {
          dialogRef._containerInstance._config.data.isLoading = false
          dialogRef.close()
          this.fetchThirdPartyInsurances()
        }
        , error: (err) => {
          dialogRef._containerInstance._config.data.isLoading = false
          dialogRef.close()
          console.log("error is ", err)
        }
      }
    )

  }


  generatePDF(id: number) {
    this.waitPrinting= true
    this.thirdPartyInsuranceService.PDFThirdPartyInsurance(id).subscribe({
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

  /*  constructor(private thirdInsuranceService: ThirdInsuranceService, private router: Router,private tokenStorageService:TokenStorageService) {
    }

    public thirdInsurances: ThirdInsurance[] = [];
    protected actualUser=this.tokenStorageService.getUser()
    protected readonly Role = Role
    fetchThirdInsurances() {
      if (this.actualUser.role == Role.User) {
        this.thirdInsuranceService.getThirdInsurancesByUser(this.actualUser.id).subscribe((Response) => {
            this.thirdInsurances = Response;
          }
          , (error) => {
            console.log("error is ", error)
          }
        );
      }
      else if (this.actualUser.role == Role.Director) {
        this.thirdInsuranceService.getThirdInsurancesByBureau(this.actualUser.bureauId).subscribe((Response) => {
            this.thirdInsurances = Response;
          }
          , (error) => {
            console.log("error is ", error)
          }
        );
      }
      else{
        this.thirdInsuranceService.getThirdInsurances().subscribe((Response) => {
            this.thirdInsurances = Response;
          }
          , (error) => {
            console.log("error is ", error)
          }
        );
      }
    }

    query: string = "";

    search() {
      if (this.query != "") {
        this.thirdInsuranceService.SearchThirdInsurances(this.query).subscribe((Response) => {
            this.thirdInsurances = Response;
          }
          , (error) => {
            console.log("error is ", error)
          }
        );
      } else {
        this.fetchThirdInsurances()
      }
    }

    ngOnInit() {
      this.fetchThirdInsurances()
    }

    delete(id: number) {
      this.thirdInsuranceService.DeletThirdInsurance(id).subscribe((Response) => {
          this.fetchThirdInsurances()
        }, (error) => {
          console.log("error is ", error)
        }
      )
    }

    generatePDF(id:number){
      this.thirdInsuranceService.PDFThirdInsurance(id).subscribe((Response)=>{
          const blob = new Blob([Response], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
        },(error)=>{console.log("error is ",error)}
      )
    }*/
}
