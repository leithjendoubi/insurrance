import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TravelInsuranceService} from "../../../../core/services/travel-insurance.service";
import {StorageService} from "../../../../core/services/storage.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DataService} from "../../../../core/services/data.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Card} from "../../../../public/shared/card";
import data from "../../../../public/data";
import moment, {Moment} from "moment/moment";
import {DatesHelper} from "../../../../public/helpers/DatesHelper";
import {MyForm} from "../../../../public/shared/my-form";
import {DialogComponent} from "../../../../public/components/dialog/dialog.component";
import {TaxesHelper} from "../../../../public/helpers/TaxesHelper";
import {TravelInsurance} from "../../../../public/models/travel-insurance.model";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-add-travel-insurance',
  templateUrl: './add-travel-insurance.component.html',
  styleUrls: ['./add-travel-insurance.component.scss']
})
export class AddTravelInsuranceComponent implements OnInit{

  constructor(private travelInsuranceService: TravelInsuranceService, private toast: NgToastService, private dialog: MatDialog, private tokenStorageService: StorageService, private router: Router, private dataService: DataService) {
  }

  actualUser = this.tokenStorageService.getUser()
  travelInsurance = new TravelInsurance()

  ngOnInit() {
    this.dataService.fetchCountriesInEnglish()
  }

  formGroup = new FormGroup({
    zone_couver: new FormControl('', Validators.required),
    periode: new FormControl('', Validators.required),
    direction: new FormControl('', Validators.required),
    startDate: new FormControl({value: '', disabled: true}, Validators.required),
    endDate: new FormControl({value: '', disabled: true}, Validators.required),
    name: new FormControl('', Validators.required),
    birthDate: new FormControl('', Validators.required),
    nationalite: new FormControl('', Validators.required),
    sex: new FormControl('', Validators.required),
    numero_passport: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}$')]),
    address: new FormControl('', Validators.required),
    methode_paiement: new FormControl('', Validators.required),
    initial: new FormControl('', [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
    taxe1: new FormControl('', [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
    taxe2: new FormControl('', [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
    taxe3: new FormControl('', [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
    taxe4: new FormControl('', [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
    total: new FormControl({
      value: '',
      disabled: true
    }, [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
  })


  cards: Card[] = [
    {
      title: "معلومات عن التأمين",
      fields: [
        {
          hasAction: 'yes',
          action: this.calculateTaxes.bind(this),
          form: {
            type: "select",
            label: "منطقة التغطية",
            hidden: false,
            formControlName: "zone_couver",
            isObject: false,
            selectOptions: data.travel_insurances.zone
          }
        },
        {
          hasAction: 'yes',
          action: this.selectInsuranceType.bind(this),
          form: {
            type: "select",
            label: "فترة التأمين",
            hidden: false,
            formControlName: "periode",
            isObject: true,
            selectOptions: data.travel_insurances.insurancePeriods,
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "select",
            label: "الوجهة",
            hidden: false,
            formControlName: "direction",
            isObject: false,
            selectOptions: this.dataService.countriesInEnglish,
          }
        },
        {
          hasAction: 'yes',
          action: this.changeEndDate.bind(this),
          form: {
            type: 'date',
            label: 'تاريخ البداية',
            hidden: false,
            minDate: new Date(),
            maxDate: DatesHelper.getDatePlusYears(50),
            formControlName: 'startDate',
          }
        },
        {
          hasAction: 'no',
          form: {
            type: 'date',
            label: 'تاريخ النهاية',
            hidden: false,
            minDate: new Date(),
            maxDate: DatesHelper.getDatePlusYears(50),
            formControlName: 'endDate',
          }
        }
      ]
    },
    {
      title: "معلومات عن المأمن",
      fields: [
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "إسم المأمن",
            hidden: false,
            formControlName: "name",
          }
        },
        {
          hasAction: 'yes',
          action: this.calculateTaxes.bind(this),
          form: {
            type: 'date',
            label: 'تاريخ الميلاد',
            hidden: false,
            minDate: DatesHelper.getDatePlusYears(-150),
            maxDate: new Date(),
            formControlName: 'birthDate',
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "select",
            label: "الجنسية",
            hidden: false,
            formControlName: "nationalite",
            isObject: false,
            selectOptions: this.dataService.countriesInEnglish,
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "select",
            label: "الجنس",
            hidden: false,
            formControlName: "sex",
            isObject: false,
            selectOptions: data.global.sexInEnglish,
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "رقم جواز السفر",
            hidden: false,
            formControlName: "numero_passport",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "tel",
            label: "رقم هاتف المأمن",
            hidden: false,
            errorsMessages: {
              pattern: 'يجب أن يتكون رقم هاتف المأمن من 10 أرقام',
            },
            formControlName: "phone",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "العنوان",
            hidden: false,
            formControlName: "address",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "select",
            label: "طريقة الدفع",
            hidden: false,
            formControlName: "methode_paiement",
            isObject: false,
            selectOptions: data.global.paymentMethods,
          }
        },
      ]
    },
    {
      title: "حساب الضرائب",
      fields: [
        {
          hasAction: 'no',
          form: {
            type: "number",
            label: "القسط الصافي",
            hidden: false,
            formControlName: "initial",
            errorsMessages: {
              min: 'يجب أن يكون القسط الصافي أكبر من 0',
            }
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "number",
            label: "الضريبة",
            hidden: false,
            formControlName: "taxe1",
            errorsMessages: {
              min: 'يجب أن تكون الضريبة أكبر من 0',
            }
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "number",
            label: "الدمغة",
            hidden: false,
            formControlName: "taxe2",
            errorsMessages: {
              min: 'يجب أن تكون الدمغة أكبر من 0',
            }
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "number",
            label: "الإشراف و الرقابة",
            hidden: false,
            formControlName: "taxe3",
            errorsMessages: {
              min: 'يجب أن تكون الإشراف و الرقابة أكبر من 0',
            }
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "number",
            label: "م الإصدار",
            hidden: false,
            formControlName: "taxe4",
            errorsMessages: {
              min: 'يجب أن يكون م الإصدار أكبر من 0',
            }
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "number",
            label: "الإجمالي",
            hidden: false,
            formControlName: "total",
            errorsMessages: {
              min: 'يجب أن يكون م الإصدار أكبر من 0',
            }
          }
        },
      ]
    }
  ]

  myForm: MyForm = {
    title: "إضافة تأمين سفر",
    formGroup: this.formGroup,
    cards: this.cards,
  }

  calculateTaxes() {
    let zone_couver = this.myForm.formGroup.get('zone_couver')
    let periodId = this.myForm.formGroup.get('periode')
    let birthDate = this.myForm.formGroup.get('birthDate')?.value

    if ((zone_couver?.value !== '' && !zone_couver?.hasError('required')) && (periodId?.value !== '' && !periodId?.hasError('required')) && birthDate !== '') {
      let age = DatesHelper.getAge(moment(birthDate).toDate())
      let taxes = TaxesHelper.calculateTravelInsuranceTax(zone_couver?.value, age, periodId?.value as number)
      this.myForm.formGroup.get('initial')?.setValue(taxes.initial)
      this.myForm.formGroup.get('taxe1')?.setValue(taxes.taxe1)
      this.myForm.formGroup.get('taxe2')?.setValue(taxes.taxe2)
      this.myForm.formGroup.get('taxe3')?.setValue(taxes.taxe3)
      this.myForm.formGroup.get('taxe4')?.setValue(taxes.taxe4)
      this.myForm.formGroup.get('total')?.setValue(taxes.total)
    }
  }

  selectInsuranceType() {
    if (this.myForm.formGroup.get('periode')?.hasError('required')) {
      this.myForm.formGroup.get('startDate')?.disable()
    } else {
      this.myForm.formGroup.get('startDate')?.setValue(moment())
      this.myForm.formGroup.get('startDate')?.enable()
      let id: number = this.myForm.formGroup.get('periode')?.value
      let endDate = DatesHelper.getEndDateFromData(id, data.travel_insurances.insurancePeriods, this.myForm.formGroup.get('startDate')?.value)
      this.myForm.formGroup.get('endDate')?.setValue(endDate)
      this.calculateTaxes()
    }

  }

  changeEndDate() {
    let id: number = this.myForm.formGroup.get('periode')?.value
    let endDate = DatesHelper.getEndDateFromData(id, data.travel_insurances.insurancePeriods, this.myForm.formGroup.get('startDate')?.value)
    this.myForm.formGroup.get('endDate')?.setValue(endDate)
  }

  addTravelInsurance(dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef._containerInstance._config.data.isLoading = true
    this.travelInsurance.zone_couver = this.myForm.formGroup.get('zone_couver')?.value
    let id: number = this.myForm.formGroup.get('periode')?.value
    let period = data.travel_insurances.insurancePeriods.find((row) => row.id === id)?.name as string
    this.travelInsurance.periode = period as string
    this.travelInsurance.direction = this.myForm.formGroup.get('direction')?.value
    this.travelInsurance.startDate = this.myForm.formGroup.get('startDate')?.value
    this.travelInsurance.endDate = this.myForm.formGroup.get('endDate')?.value
    this.travelInsurance.name = this.myForm.formGroup.get('name')?.value
    this.travelInsurance.birthDate = this.myForm.formGroup.get('birthDate')?.value
    this.travelInsurance.nationalite = this.myForm.formGroup.get('nationalite')?.value
    this.travelInsurance.sex = this.myForm.formGroup.get('sex')?.value
    this.travelInsurance.numero_passport = this.myForm.formGroup.get('numero_passport')?.value
    this.travelInsurance.address = this.myForm.formGroup.get('address')?.value
    this.travelInsurance.phone = this.myForm.formGroup.get('phone')?.value
    this.travelInsurance.methode_paiement = this.myForm.formGroup.get('methode_paiement')?.value
    this.travelInsurance.initial = this.myForm.formGroup.get('initial')?.value
    this.travelInsurance.taxe1 = this.myForm.formGroup.get('taxe1')?.value
    this.travelInsurance.taxe2 = this.myForm.formGroup.get('taxe2')?.value
    this.travelInsurance.taxe3 = this.myForm.formGroup.get('taxe3')?.value
    this.travelInsurance.taxe4 = this.myForm.formGroup.get('taxe4')?.value
    this.travelInsurance.total = this.myForm.formGroup.get('total')?.value
    this.travelInsurance.userId = this.tokenStorageService.getUser().id
    this.travelInsuranceService.createTravelInsurance(this.travelInsurance).subscribe({
        next: () => {
          dialogRef._containerInstance._config.data.isLoading = false
          dialogRef.close()
          this.router.navigate(['/dashboard/travelInsurances'])
          //this.toast.success({detail:"تأمين سفر",summary:'تأمين أضيف بنجاح',duration:2000});
        }, error: (err) => {
          dialogRef._containerInstance._config.data.isLoading = false
          dialogRef.close()
          //this.myForm.formGroup.reset()
          //this.toast.error({detail:"تأمين سفر",summary:'خلل أثناء إصافة التأمين',duration:2000});
          console.log(err);
        }
      }
    )
  }

  onSubmit() {
    if (!this.myForm.formGroup.pristine && this.myForm.formGroup.valid) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: "تأمين المسافرين",
          content: "هل تريد إضافة هذا التأمين الخاص بالمسافرين ؟",
          isLoading: false,
          onSubmit: () => this.addTravelInsurance(dialogRef)

        }, autoFocus: false, panelClass: 'choice-dialog-container'
      });
    }
  }
}
