import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AddHealthInsuranceComponent} from "../add-health-insurance.component";
import {StorageService} from "../../../../../core/services/storage.service";
import {PersonHealthInsuranceService} from "../../../../../core/services/person-health-insurance.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {PersonHealthInsurance} from "../../../../../public/models/person-health-insurance.model";
import {TravelInsuranceService} from "../../../../../core/services/travel-insurance.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DataService} from "../../../../../core/services/data.service";
import {TravelInsurance} from "../../../../../public/models/travel-insurance.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Card} from "../../../../../public/shared/card";
import data from "../../../../../public/data";
import {DatesHelper} from "../../../../../public/helpers/DatesHelper";
import {MyForm} from "../../../../../public/shared/my-form";
import moment, {Moment} from "moment";
import {TaxesHelper} from "../../../../../public/helpers/TaxesHelper";
import {DialogComponent} from "../../../../../public/components/dialog/dialog.component";
import {MatSelectChange} from "@angular/material/select";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";

@Component({
  selector: 'app-add-person-health-insurance',
  templateUrl: './add-person-health-insurance.component.html',
  styleUrls: ['./add-person-health-insurance.component.scss']
})
export class AddPersonHealthInsuranceComponent {

  @Output() insuranceEvent = new EventEmitter<string>();
  @Input() type!: string

  constructor(private personHealthInsuranceService: PersonHealthInsuranceService, private dialog: MatDialog, private tokenStorageService: StorageService, private router: Router, private dataService: DataService) {
  }

  actualUser = this.tokenStorageService.getUser()
  personHealthInsurance = new PersonHealthInsurance()

  ngOnInit() {
    this.dataService.fetchCountries()
  }

  formGroup = new FormGroup({
    type: new FormControl('صحي فرد', Validators.required),
    period: new FormControl('', Validators.required),
    job: new FormControl('', Validators.required),
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
    initial: new FormControl('', [Validators.required, Validators.min(0)]),
    taxe1: new FormControl('', [Validators.required, Validators.min(0)]),
    taxe2: new FormControl('', [Validators.required, Validators.min(0)]),
    taxe3: new FormControl('', [Validators.required, Validators.min(0)]),
    taxe4: new FormControl('', [Validators.required, Validators.min(0)]),
    total: new FormControl({value: '', disabled: true}, [Validators.required, Validators.min(0)]),
  })


  cards: Card[] = [
    {
      title: "معلومات عن التأمين",
      fields: [
        {
          hasAction: 'yes',
          action: this.changeType.bind(this),
          form: {
            type: "select",
            label: "نوعية التأمين",
            hidden: false,
            formControlName: "type",
            isObject: false,
            selectOptions: data.health_insurance.types
          }
        },
        {
          hasAction: 'yes',
          action: this.selectInsuranceType.bind(this),
          form: {
            type: "select",
            label: "فترة التأمين",
            hidden: false,
            formControlName: "period",
            isObject: true,
            selectOptions: data.health_insurance.insurancePeriods,
          }
        },
        {
          hasAction: 'yes',
          action: this.calculateTaxes.bind(this),
          form: {
            type: "select",
            label: "المهنة",
            hidden: false,
            formControlName: "job",
            isObject: false,
            selectOptions: data.health_insurance.jobs,
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
          hasAction: 'no',
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
            selectOptions: this.dataService.countries,
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
            selectOptions: data.global.sex,
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
          hasAction: 'yes',
          form: {
            type: "number",
            label: "القسط الصافي",
            hidden: false,
            formControlName: "initial",
            errorsMessages: {
              min: 'يجب أن يكون القسط الصافي أكبر من 0',
            }
          },
          action: this.calculateTotal.bind(this),
        },
        {
          hasAction: 'yes',
          form: {
            type: "number",
            label: "الضريبة",
            hidden: false,
            formControlName: "taxe1",
            errorsMessages: {
              min: 'يجب أن تكون الضريبة أكبر من 0',
            }
          },
          action: this.calculateTotal.bind(this),
        },
        {
          hasAction: 'yes',
          form: {
            type: "number",
            label: "الدمغة",
            hidden: false,
            formControlName: "taxe2",
            errorsMessages: {
              min: 'يجب أن تكون الدمغة أكبر من 0',
            }
          },
          action: this.calculateTotal.bind(this),
        },
        {
          hasAction: 'yes',
          form: {
            type: "number",
            label: "الإشراف و الرقابة",
            hidden: false,
            formControlName: "taxe3",
            errorsMessages: {
              min: 'يجب أن تكون الإشراف و الرقابة أكبر من 0',
            }
          },
          action: this.calculateTotal.bind(this),
        },
        {
          hasAction: 'yes',
          form: {
            type: "number",
            label: "م الإصدار",
            hidden: false,
            formControlName: "taxe4",
            errorsMessages: {
              min: 'يجب أن يكون م الإصدار أكبر من 0',
            }
          },
          action: this.calculateTotal.bind(this),
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
    title: "إضافة مسؤلية صحية",
    formGroup: this.formGroup,
    cards: this.cards,
  }

  isFloat(n:any) {
    return n === +n && n !== (n|0);
  }

  calculateTaxes() {
    let type = this.myForm.formGroup.get('type')
    let job = this.myForm.formGroup.get('job')
    if ((type?.value !== '' && !type?.hasError('required')) && (job?.value !== '' && !job?.hasError('required'))) {
      let taxes = TaxesHelper.calculatePersonHealthInsuranceTax(type?.value, job?.value)
      this.myForm.formGroup.get('initial')?.setValue(taxes.initial)
      this.myForm.formGroup.get('taxe1')?.setValue(taxes.taxe1)
      this.myForm.formGroup.get('taxe2')?.setValue(taxes.taxe2)
      this.myForm.formGroup.get('taxe3')?.setValue(taxes.taxe3)
      this.myForm.formGroup.get('taxe4')?.setValue(taxes.taxe4)
      //this.myForm.formGroup.get('totalTaxes')?.setValue(taxes.initial + taxes.taxe4+taxes.taxe3+taxes.taxe2+taxes.taxe1)
      //this.myForm.formGroup.get('total')?.setValue(taxes.total)
      const total= taxes.initial+taxes.taxe1+taxes.taxe2+taxes.taxe3+taxes.taxe4
      this.isFloat(total) ?
        this.myForm.formGroup.get('total')?.setValue(total.toFixed(3))
      : this.myForm.formGroup.get('total')?.setValue(total)
    }
  }

  calculateTotal(){
    let total = parseFloat(this.myForm.formGroup.get('initial')?.value)+parseFloat(this.myForm.formGroup.get('taxe1')?.value)+parseFloat(this.myForm.formGroup.get('taxe2')?.value)+parseFloat(this.myForm.formGroup.get('taxe3')?.value)+parseFloat(this.myForm.formGroup.get('taxe4')?.value)
    this.myForm.formGroup.get('total')?.setValue(total.toFixed(2))
  }

  selectInsuranceType() {
    if (this.myForm.formGroup.get('period')?.hasError('required')) {
      this.myForm.formGroup.get('startDate')?.disable()
    } else {
      this.myForm.formGroup.get('startDate')?.setValue(moment())
      this.myForm.formGroup.get('startDate')?.enable()
      let id: number = this.myForm.formGroup.get('period')?.value
      let endDate = DatesHelper.getEndDateFromData(id, data.health_insurance.insurancePeriods, this.myForm.formGroup.get('startDate')?.value)
      this.myForm.formGroup.get('endDate')?.setValue(endDate)
    }
  }

  changeEndDate() {
    let id: number = this.myForm.formGroup.get('period')?.value
    let endDate = DatesHelper.getEndDateFromData(id, data.health_insurance.insurancePeriods, this.myForm.formGroup.get('startDate')?.value)
    this.myForm.formGroup.get('endDate')?.setValue(endDate)
  }

  addPersonHealthInsurance(dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef._containerInstance._config.data.isLoading = true
    this.personHealthInsurance.type = "صحي فرد"
    let id: number = this.myForm.formGroup.get('period')?.value
    let period = data.health_insurance.insurancePeriods.find((row) => {
      return row.id === id
    })?.name
    this.personHealthInsurance.period = period as string
    this.personHealthInsurance.job = this.myForm.formGroup.get('job')?.value
    this.personHealthInsurance.startDate = this.myForm.formGroup.get('startDate')?.value
    this.personHealthInsurance.endDate = this.myForm.formGroup.get('endDate')?.value
    this.personHealthInsurance.name = this.myForm.formGroup.get('name')?.value
    this.personHealthInsurance.birthDate = this.myForm.formGroup.get('birthDate')?.value
    this.personHealthInsurance.nationalite = this.myForm.formGroup.get('nationalite')?.value
    this.personHealthInsurance.sex = this.myForm.formGroup.get('sex')?.value
    this.personHealthInsurance.numero_passport = this.myForm.formGroup.get('numero_passport')?.value
    this.personHealthInsurance.address = this.myForm.formGroup.get('address')?.value
    this.personHealthInsurance.phone = this.myForm.formGroup.get('phone')?.value
    this.personHealthInsurance.methode_paiement = this.myForm.formGroup.get('methode_paiement')?.value
    this.personHealthInsurance.initial = this.myForm.formGroup.get('initial')?.value
    this.personHealthInsurance.taxe1 = this.myForm.formGroup.get('taxe1')?.value
    this.personHealthInsurance.taxe2 = this.myForm.formGroup.get('taxe2')?.value
    this.personHealthInsurance.taxe3 = this.myForm.formGroup.get('taxe3')?.value
    this.personHealthInsurance.taxe4 = this.myForm.formGroup.get('taxe4')?.value
    this.personHealthInsurance.total = this.myForm.formGroup.get('total')?.value
    this.personHealthInsurance.userId = this.tokenStorageService.getUser().id
    this.personHealthInsuranceService.createPersonHealthInsurance(this.personHealthInsurance).subscribe({
        next: () => {
          dialogRef._containerInstance._config.data.isLoading = false
          dialogRef.close()
          this.router.navigate(['/dashboard/healthInsurances'])
        }, error: (err) => {
          dialogRef._containerInstance._config.data.isLoading = false
          dialogRef.close()
          this.myForm.formGroup.reset()
          console.log(err);
        }
      }
    )
  }

  changeType(e:Event | MatSelectChange | MatDatepickerInputEvent<any, any>) {
    let type = ""
    if (e instanceof MatSelectChange) {
      type = e.value
    }
    this.type=type
    this.insuranceEvent.emit(type);
    this.calculateTaxes()
  }

  onSubmit() {
    if (!this.myForm.formGroup.pristine && this.myForm.formGroup.valid) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: "تأمين صحي للفرد",
          content: "هل تريد إضافة هذا التأمين الصحي الخاص بالأفراد ؟",
          isLoading: false,
          onSubmit: () => this.addPersonHealthInsurance(dialogRef)

        }, autoFocus: false, panelClass: 'choice-dialog-container'
      });
    }
    else {
      console.log(this.myForm.formGroup)
      console.log(this.myForm.formGroup.valid)
    }
  }

}
