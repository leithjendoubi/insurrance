import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {User} from "../../../public/models/user.model";
import {OfficeService} from "../../../core/services/office.service";
import {UserService} from "../../../core/services/user.service";
import {MyForm} from "../../../public/shared/my-form";
import {Card} from "../../../public/shared/card";
import {DialogComponent} from "../../../public/components/dialog/dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Office} from "../../../public/models/office.model";

@Component({
  selector: 'app-update-office',
  templateUrl: './update-office.component.html',
  styleUrls: ['./update-office.component.scss']
})
export class UpdateOfficeComponent {
  constructor(private officeService: OfficeService, private userService: UserService, private router: Router, private dialog: MatDialog) {
  }

  office: Office = history.state?.data;
  director = new User();

  cards: Card[] = [
    {
      title: "معلومات عن المكتب",
      fields: [
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "إسم المكتب",
            hidden: false,
            formControlName: "officeName",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "عنوان المكتب",
            hidden: false,
            formControlName: "officeAddress",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "tel",
            label: "رقم هاتف المكتب",
            hidden: false,
            errorsMessages: {
              pattern: 'يجب أن يتكون رقم هاتف المكتب من 10 أرقام',
            },
            formControlName: "officePhone",
          }
        },
      ]
    },
    {
      title: "معلومات عن مدير المكتب",
      fields: [
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "إسم مستخدم المدير",
            hidden: false,
            formControlName: "directorUsername",
          }
        },
        /*{
          label: "كلمة مرور المدير",
          type: "password",
          readonly:true,
          formControlName: "directorPassword",
        },*/
        {
          hasAction: 'no',
          form: {
            type: "tel",
            label: "رقم هاتف المدير",
            hidden: false,
            errorsMessages: {
              minLength: 'يجب أن يتكون رقم هاتف المكتب من 10 أرقام',
              maxLength: 'يجب أن يتكون رقم هاتف المكتب من 10 أرقام'
            },
            formControlName: "directorPhone",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "عنوان المدير",
            hidden: false,
            formControlName: "directorAddress",
          }
        },
      ]
    },
    {
      title: "نسبة الربح",
      fields: [
        {
          hasAction: 'no',
          form: {
            type: "number",
            label: "إجباري",
            hidden: false,
            formControlName: "percentageObligatory",
            errorsMessages: {
              min: 'يجب أن تكون نسبة الربح للإجباري أكبر من 0',
              max: 'يجب أن تكون نسبة الربح للإجباري أقل من 100'
            }
          }
        },
        {
          hasAction: 'no',
          form:{
            type: "number",
            label: "طرف ثالث",
            hidden: false,
            formControlName: "percentageThird",
            errorsMessages: {
              min: 'يجب أن تكون نسبة الربح للطرف الثالث أكبر من 0',
              max: 'يجب أن تكون نسبة الربح للطرف الثالث أقل من 100'
            }
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "number",
            label: "تأمين صحي",
            hidden: false,
            formControlName: "percentageHealth",
            errorsMessages: {
              min: 'يجب أن تكون نسبة الربح للتأمين الصحي أكبر من 0',
              max: 'يجب أن تكون نسبة الربح للتأمين الصحي أقل من 100'
            }
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "number",
            label: "مسافرين",
            hidden: false,
            formControlName: "percentageTravel",
            errorsMessages: {
              min: 'يجب أن تكون نسبة الربح للمسافرين أكبر من 0',
              max: 'يجب أن تكون نسبة الربح للمسافرين أقل من 100'
            }
          }
        },
      ]
    }
  ]


  myForm: MyForm = {
    title: "تعديل مكتب",
    formGroup: new FormGroup({
      officeName: new FormControl(this.office.name, Validators.required),
      officeAddress: new FormControl(this.office.address, Validators.required),
      officePhone: new FormControl(this.office.phone, [Validators.required, Validators.pattern('[0-9]{10}$')]),
      directorUsername: new FormControl({value: '', disabled: true}, Validators.required),
      //directorPassword: new FormControl('',Validators.required),
      directorAddress: new FormControl({value: '', disabled: true}, Validators.required),
      directorPhone: new FormControl({
        value: '',
        disabled: true
      }, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      percentageObligatory: new FormControl(this.office.gain_precentage_oblig, [Validators.required, Validators.min(0), Validators.max(100)]),
      percentageThird: new FormControl(this.office.gain_precentage_third, [Validators.required, Validators.min(0), Validators.max(100)]),
      percentageHealth: new FormControl(this.office.gain_precentage_sante, [Validators.required, Validators.min(0), Validators.max(100)]),
      percentageTravel: new FormControl(this.office.gain_precentage_travel, [Validators.required, Validators.min(0), Validators.max(100)]),
    }),
    cards: this.cards
  }

  fetchData() {
    this.userService.getUserById(this.office.directorId).subscribe((Response) => {
      this.myForm.formGroup.get('directorUsername')?.setValue(Response.username)
      this.myForm.formGroup.get('directorAddress')?.setValue(Response.address)
      this.myForm.formGroup.get('directorPhone')?.setValue(Response.phone)
    })
  }

  ngOnInit(): void {
    this.fetchData()
  }


  onSubmit() {
    if (!this.myForm.formGroup.pristine && this.myForm.formGroup.valid) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: "المكاتب",
          content: "هل تريد تعديل هذا المكتب ؟",
          isLoading: false,
            onSubmit: () => this.updateOffice(dialogRef)
        }, autoFocus: false, panelClass: 'choice-dialog-container'
      });

    }
  }

  updateOffice(dialogRef:MatDialogRef<DialogComponent>) {

    dialogRef.componentInstance.data.isLoading = true
    const form = this.myForm.formGroup
    this.office.name = form.get('officeName')?.value
    this.office.address = form.get('officeAddress')?.value
    this.office.phone = form.get('officePhone')?.value
    this.office.gain_precentage_oblig = form.get('percentageObligatory')?.value
    this.office.gain_precentage_third = form.get('percentageThird')?.value
    this.office.gain_precentage_sante = form.get('percentageHealth')?.value
    this.office.gain_precentage_travel = form.get('percentageTravel')?.value
    this.officeService.UpdateOffice(this.office).subscribe({
      next:data => {
        dialogRef.componentInstance.data.isLoading = false
        dialogRef.close()
        this.router.navigate(['/dashboard/offices'])
      },error:err => {
        dialogRef.componentInstance.data.isLoading = false
        dialogRef.close()
        console.log(err)
      }
    })
  }
}
