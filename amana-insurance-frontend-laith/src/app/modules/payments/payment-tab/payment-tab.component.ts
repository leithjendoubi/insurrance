import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Column} from "../../../public/shared/column";
import {Office} from "../../../public/models/office.model";
import {PaymentService} from "../../../core/services/payment.service";
import {Payment} from "../../../public/models/payment.model";
import {DialogComponent} from "../../../public/components/dialog/dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {StorageService} from "../../../core/services/storage.service";
import {Role} from "../../../public/enum/Role";
import moment from "moment";
import {TablesHelper} from "../../../public/helpers/TablesHelper";

@Component({
  selector: 'app-payment-tab',
  templateUrl: './payment-tab.component.html',
  styleUrls: ['./payment-tab.component.scss']
})
export class PaymentTabComponent implements OnInit{

  constructor(private paymentService: PaymentService ,private storageService:StorageService, private router: Router, private dialog: MatDialog){
  }
  payments:Array<Payment>=[]
  tableColumns: Array<Column> = [
    {columnDef: 'id', header: 'No.', cell: (element: Record<string, number>) => `${this.payments.findIndex((payment) => payment.id === element['id']) + 1}`},
    {columnDef: 'office', header: 'إسم المكتب', cell: (element: Record<string, Office>) => `${element['bureau'] != null ? element['bureau'].name : 'إدارة مكاتب'}`},
    {columnDef: 'directorUsername', header: 'إسم مستخدم المدير', cell: (element: Record<string, Office>) => `${element['bureau'].director.username}`},
    {columnDef: 'paymentDate', header: 'تاريخ المطلب', cell: (element: Record<string, Date>) => `${moment(element['createdAt']).format('LL')}`},
    {columnDef: 'status', header: 'الحالة', cell: (element: Record<string, number>) => `${element['state']===0 ? 'قيد المراجعة' : element['state']===-1  ? 'مرفوض' :'تم الموافقة'}`},
    {columnDef: 'amount', header: 'المبلغ المدفوع ( د.ل )', cell: (element: Record<string, number>) => `${element['amount']}`},
    {columnDef: 'TotalDebts', header: 'المبلغ الجملي ( د.ل )', cell: (element: Record<string, number>) => `${element['totalDebts']}`},
    {columnDef: 'settings', header: '', cell: (element: Record<string, any>) => `${element['settings']}`}
  ];
  addButton = {
    label: 'إضافة مطلب إستخلاص',
    icon: 'add_card',
    disabled: false
  }
  actualUser = this.storageService.getUser();
  waitUploading: boolean = false

  fetchPayments() {
    this.actualUser?.role === Role.Admin || this.actualUser.role=== Role.Finance ?
      this.paymentService.getPayments().subscribe({
          next: (Response) => {
            this.payments = Response
            TablesHelper.sortPaymentTable(this.payments)
          }, error: err => {
            console.log("error is ", err)
          }
        }
      ) :
      this.paymentService.getPaymentsByOffice(this.storageService.getUser()?.bureauId).subscribe({
          next: (Response) => {
            this.payments = Response
            TablesHelper.sortPaymentTable(this.payments)
            this.payments.findIndex((payment) => payment.state === 0) !== -1
              ? this.addButton.disabled=true
              : this.addButton.disabled=false

          }, error: err => {
            console.log("error is ", err)
          }
        }
      )


  }

  ngOnInit(): void {
    this.fetchPayments()
  }

  search(searchKey: string) {
    if (searchKey != "") {
        this.paymentService.SearchPayments(searchKey).subscribe({
            next: (Response) => {
              this.payments = Response
            }, error: err => {
              console.log("error is ", err)
            }
          }
        );
    } else {
      this.fetchPayments()
    }
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "مطالب الإستخلاص",
        content: "هل تريد حذف هذا المطلب ؟",
        isLoading: false,
        onSubmit: () => this.deleteRow(id, dialogRef)
      }, autoFocus: false, panelClass: 'choice-dialog-container'
    });
  }

  deleteRow(id: number, dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef.componentInstance.data.isLoading = true
    this.paymentService.DeletePayment(id).subscribe({
        next: (Response) => {
          dialogRef.componentInstance.data.isLoading = false
          dialogRef.close()
          this.fetchPayments()
        }, error: err => {
          dialogRef.componentInstance.data.isLoading = false
          dialogRef.close()
          console.log("error is ", err)
        }
      }
    )
  }

  onAcceptPayment(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "مطالب الإستخلاص",
        content: "هل تريد قبول هذا المطلب ؟",
        isLoading: false,
        onSubmit: () => this.acceptPayment(id, dialogRef)
      }, autoFocus: false, panelClass: 'choice-dialog-container'
    });
  }

  acceptPayment(id: number, dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef.componentInstance.data.isLoading = true
    this.paymentService.acceptPayment(id).subscribe({
        next: (Response) => {
          dialogRef.componentInstance.data.isLoading = false
          dialogRef.close()
          this.fetchPayments()
        }, error: err => {
          dialogRef.componentInstance.data.isLoading = false
          dialogRef.close()
          console.log("error is ", err)
        }
      }
    )
  }

  onRejectPayment(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "مطالب الإستخلاص",
        content: "هل تريد رفض هذا المطلب ؟",
        isLoading: false,
        onSubmit: () => this.rejectPayment(id, dialogRef)
      }, autoFocus: false, panelClass: 'choice-dialog-container'
    });
  }

  rejectPayment(id: number, dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef.componentInstance.data.isLoading = true
    this.paymentService.rejectPayment(id).subscribe({
        next: (Response) => {
          dialogRef.componentInstance.data.isLoading = false
          dialogRef.close()
          this.fetchPayments()
        }, error: err => {
          dialogRef.componentInstance.data.isLoading = false
          dialogRef.close()
          console.log("error is ", err)
        }
      }
    )
  }

  getBill(payment:Payment){
    this.waitUploading=true
    this.paymentService.GetPaymentFile(payment.bill.path).subscribe({
      next: (Response) => {
        this.waitUploading=false
        const blob = new Blob([Response], {type: payment.bill.type});
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      }, error: err => {
        this.waitUploading = false
        console.log("error is ", err)
      }
    })
  }
}
