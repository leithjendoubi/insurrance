import {Component, OnInit} from '@angular/core';
import {PaymentService} from "../../../core/services/payment.service";
import {Router} from "@angular/router";
import {StorageService} from "../../../core/services/storage.service";
import {Payment} from "../../../public/models/payment.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Office} from "../../../public/models/office.model";
import {OfficeService} from "../../../core/services/office.service";
import {Card} from "../../../public/shared/card";
import data from "../../../public/data";
import {MyForm} from "../../../public/shared/my-form";
import {ObjectsHelper} from "../../../public/helpers/ObjectsHelper";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../../../public/components/dialog/dialog.component";

@Component({
  selector: 'app-payment-demand',
  templateUrl: './payment-demand.component.html',
  styleUrls: ['./payment-demand.component.scss']
})
export class PaymentDemandComponent implements OnInit {

  actualUser = this.storageService.getUser()
  addDisabled = false
  office = new Office()
  constructor(private paymentService: PaymentService ,private officeService:OfficeService,private storageService:StorageService, private router: Router,private dialog:MatDialog){
  }

  ngOnInit(): void {
    this.officeService.getOfficeById(this.actualUser?.bureauId).subscribe({
      next: (Response) => {
        this.office = Response
        if(this.office.totalDebts === 0){
          this.addDisabled = true
        }
        this.myForm.formGroup.get('totalDebts')?.setValue(this.office.totalDebts)
        this.myForm.formGroup.get('amount')?.setValidators([Validators.required,Validators.min(1),Validators.max(this.office.totalDebts)])
        this.myForm.formGroup.get('rest')?.setValue(this.office.totalDebts-1)
      }, error: err => {
        console.log("error is ", err)
      }
    })
  }

  formGroup = new FormGroup({
    totalDebts: new FormControl({value:0,disabled:true}, Validators.required),
    amount: new FormControl(1, [Validators.required,Validators.min(1)]),
    rest: new FormControl({value:0,disabled:true}, Validators.required),
    bill: new FormControl('', Validators.required),
  })

  cards: Card[] = [
    {
      title: "",
      fields: [
        {
          hasAction: 'no',
          //action: this.calculateTaxes.bind(this),
          form: {
            type: "number",
            label: "المبلغ الجملي",
            hidden: false,
            formControlName: "totalDebts",

          }
        },
        {
          hasAction: 'yes',
          action: this.calculateRest.bind(this),
          form: {
            type: "number",
            label: "المبلغ المدفوع",
            hidden: false,
            formControlName: "amount",
            errorsMessages:{
              max:"المبلغ المدفوع يجب أن لا يتجاوز المبلغ الجملي",
              min:'المبلغ المدفوع يجب أن لا يكون سالبا أو صفرا'
            }
          }
        },
        {
          hasAction: 'no',
          //action: this.calculateTaxes.bind(this),
          form: {
            type: "number",
            label: "المبلغ المتبقي",
            hidden: false,
            formControlName: "rest",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "file",
            label: "الفاتورة",
            hidden: false,
            formControlName: "bill",
          }
        },
      ]
    }]

  myForm: MyForm = {
    title: "مطلب إستخلاص مديونية",
    formGroup: this.formGroup,
    cards: this.cards,
  }

  calculateRest(){
    const total = this.formGroup.get('totalDebts')?.value as number
    const amount = this.formGroup.get('amount')?.value as number
    if(!ObjectsHelper.isEmpty(total) && !ObjectsHelper.isEmpty(amount) && this.formGroup.get('amount')?.valid){
      this.formGroup.get('rest')?.setValue(parseFloat((total-amount).toFixed(3)))
    }

  }

  file_store!: FileList;

  handleFileInputChange(l: FileList | null): void {
    this.file_store = l as FileList;
    if (l !== null) {
      if (l.length) {
        const f = l[0];
        const count = l.length > 1 ? `(+${l.length - 1} files)` : "";
        this.myForm.formGroup.get('bill')?.patchValue(`${f.name}${count}`);
      } else {
        this.myForm.formGroup.get('bill')?.patchValue("");
      }
    }
  }

  addPayment(dialogRef: MatDialogRef<DialogComponent>): void {
    dialogRef._containerInstance._config.data.isLoading = true
    let fd = new FormData();
    for (let i = 0; i < this.file_store.length; i++) {
      fd.append("file", this.file_store[i], this.file_store[i].name);
    }
    fd.append("state",(0).toString());
    fd.append("amount", this.myForm.formGroup.get('amount')?.value);
    fd.append("bureauId", this.actualUser?.bureauId.toString() as string);
    fd.append("paymentBillId", this.myForm.formGroup.get('bill')?.value);
    this.paymentService.createPayment(fd).subscribe({
      next: () => {
        dialogRef._containerInstance._config.data.isLoading = false
        dialogRef.close()
        this.router.navigate(['/dashboard/payments'])
      },error : err => {
        dialogRef._containerInstance._config.data.isLoading = false
        dialogRef.close()
        console.log(err)
      }
    })
  }

  onSubmit() {
    if (!this.myForm.formGroup.pristine && this.myForm.formGroup.valid) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: "مطالب الإستخلاص",
          content: "هل تريد إضافة هذا المطلب ؟",
          isLoading: false,
          onSubmit: () => this.addPayment(dialogRef)
        }, autoFocus: false, panelClass: 'choice-dialog-container'
      });
    }
  }



  /*debt=new Debt()
  show:boolean=false
  recentPaidedAmount:number=0

  constructor (private debtService:PaymentService, private router:Router, private tokenStorageService:StorageService) {}
  calculer_reste(){
    this.debt.remainingAmount=this.debt.total-(this.debt.paidAmount+this.recentPaidedAmount)
  }

  getRecenetPaidAmount(){
    const data={
      startDate:this.debt.startDate,
      endDate:this.debt.endDate,
    }
    this.debtService.SearchPaidDebtsBetween(data).subscribe(
      (data) => {
        this.recentPaidedAmount = data
        this.debt.remainingAmount=this.debt.total-this.recentPaidedAmount
      },
      (err) => {
        console.log(err)
      }
    )
  }


  ngOnInit() {
    this.debt.startDate=history.state?.startDate
    this.debt.endDate=history.state?.endDate
    this.debt.total=history.state?.total
    this.getRecenetPaidAmount()

  }

  addPayment(){
    this.debt.bureauId=this.tokenStorageService.getUser().bureauId
    this.debtService.createDebt(this.debt).subscribe({
      next: () => {
        this.show=true
        this.router.navigate(['/RapportTous'])
      },
      error: (err) => {
        console.log(err)
      }
    })
  }*/
}
