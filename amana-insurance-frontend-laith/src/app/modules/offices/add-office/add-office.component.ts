import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {OfficeService} from "../../../core/services/office.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Card} from "../../../public/shared/card";
import {MyForm} from "../../../public/shared/my-form";
import {DialogComponent} from "../../../public/components/dialog/dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {confirmPasswordValidator} from "../../../core/validators/confirm-password.validator";

@Component({
  selector: 'app-add-office',
  templateUrl: './add-office.component.html',
  styleUrls: ['./add-office.component.scss']
})
export class AddOfficeComponent{
  showPassword = false;
  showConfirmPassword = false;
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
            errorsMessages: {
              alreadyExist: 'إسم المستخدم موجود بالفعل'
            }
          }
        },
        {
          hasAction: 'no',
          form: {
            type: this.showPassword ? "text" : "password",
            label: "كلمة مرور المدير",
            hidden: false,
            suffix_icon: this.showPassword ? "visibility" : "visibility_off",
            showPassword: () => {
              this.showPassword = !this.showPassword
            },
            formControlName: "directorPassword",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: this.showConfirmPassword ? "text" : "password",
            label: 'تأكيد كلمة مرور المدير',
            hidden: false,
            formControlName: "directorConfirmPassword",
            suffix_icon: this.showConfirmPassword ? "visibility" : "visibility_off",
            showPassword: () => {
              this.showConfirmPassword = !this.showConfirmPassword
            },
            errorsMessages: {
              matching: 'كلمة المرور غير متطابقة'
            }
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "tel",
            label: "رقم هاتف المدير",
            hidden: false,
            errorsMessages: {
              minLength: 'يجب أن يتكون رقم هاتف المكتب من 8 أرقام',
              maxLength: 'يجب أن يتكون رقم هاتف المكتب من 8 أرقام'
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
          form: {
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
    title: "إضافة مكتب جديد",
    formGroup: new FormGroup({
      officeName: new FormControl('', Validators.required),
      officeAddress: new FormControl('', Validators.required),
      officePhone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{8}$')]),
      directorUsername: new FormControl('', Validators.required),
      directorPassword: new FormControl('', Validators.required),
      directorConfirmPassword: new FormControl('', [Validators.required, confirmPasswordValidator('directorPassword')]),
      directorAddress: new FormControl('', Validators.required),
      directorPhone: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
      percentageObligatory: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      percentageThird: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      percentageHealth: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      percentageTravel: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
    }),
    cards: this.cards
  }

  constructor(private officeService: OfficeService, private dialog: MatDialog, private router: Router) {
  }

  onSubmit() {
    if (!this.myForm.formGroup.pristine && this.myForm.formGroup.valid) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: "المكاتب",
          content: "هل تريد إضافة هذا المكتب ؟",
          isLoading: false,
          onSubmit: () => this.addOffice(dialogRef)
        }, autoFocus: false, panelClass: 'choice-dialog-container'
      });

    }
  }

  addOffice(dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef.componentInstance.data.isLoading = true
    const form = this.myForm.formGroup
    const request = {
      name: form.get("officeName")?.value,
      address: form.get("officeAddress")?.value,
      phone: form.get("officePhone")?.value,
      gain_precentage_oblig: form.get("percentageObligatory")?.value,
      gain_precentage_travel: form.get("percentageTravel")?.value,
      gain_precentage_third: form.get("percentageThird")?.value,
      gain_precentage_sante: form.get("percentageHealth")?.value,
      director: {
        username: form.get("directorUsername")?.value,
        password: form.get("directorPassword")?.value,
        phone: form.get("directorPhone")?.value,
        address: form.get("directorAddress")?.value,
      }
    }
    this.officeService.createOffice(request).subscribe({
      next: (Response) => {
        dialogRef.componentInstance.data.isLoading = false
        dialogRef.close()
        this.router.navigate(['/dashboard/offices'])
      }, error: (err) => {
        dialogRef.componentInstance.data.isLoading = false
        dialogRef.close()
        if (err.status === 422) {
          this.myForm.formGroup.get("directorUsername")?.setErrors({alreadyExist: true})
        }
      }
    })
  }

}
