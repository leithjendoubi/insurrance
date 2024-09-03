import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ThirdPartyInsuranceService} from "../../../../core/services/third-party-insurance.service";
import {StorageService} from "../../../../core/services/storage.service";
import {ThirdPartyInsurance} from "../../../../public/models/third-party-insurance.model";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DataService} from "../../../../core/services/data.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Card} from "../../../../public/shared/card";
import data from "../../../../public/data";
import {DatesHelper} from "../../../../public/helpers/DatesHelper";
import {MyForm} from "../../../../public/shared/my-form";
import moment from "moment";
import {TaxesHelper} from "../../../../public/helpers/TaxesHelper";
import {DialogComponent} from "../../../../public/components/dialog/dialog.component";
@Component({
  selector: 'app-update-third-party-insurance',
  templateUrl: './update-third-party-insurance.component.html',
  styleUrls: ['./update-third-party-insurance.component.scss']
})
export class UpdateThirdPartyInsuranceComponent implements OnInit{
  constructor(private thirdPartyInsuranceService: ThirdPartyInsuranceService, private dialog: MatDialog, private tokenStorageService: StorageService, private router: Router, private dataService: DataService) {
  }

  actualUser = this.tokenStorageService.getUser()
  thirdPartyInsurance = history.state.data as ThirdPartyInsurance
  years: string[] = []
  formGroup = new FormGroup({
    name: new FormControl(this.thirdPartyInsurance.name, Validators.required),
    address: new FormControl(this.thirdPartyInsurance.address, Validators.required),
    phone: new FormControl(this.thirdPartyInsurance.phone, [Validators.required, Validators.pattern('[0-9]{10}$')]),
    driver_name: new FormControl(this.thirdPartyInsurance.driver_name, Validators.required),
    driver_address: new FormControl(this.thirdPartyInsurance.driver_address, Validators.required),
    driver_phone: new FormControl(this.thirdPartyInsurance.driver_phone, [Validators.required, Validators.pattern('[0-9]{10}$')]),
    insurance_type: new FormControl(parseInt(this.thirdPartyInsurance.insurance_type), Validators.required),
    startDate: new FormControl(this.thirdPartyInsurance.startDate, Validators.required),
    endDate: new FormControl({value: this.thirdPartyInsurance.endDate, disabled: true}, Validators.required),
    permission_type: new FormControl(this.thirdPartyInsurance.license_type, Validators.required),
    description: new FormControl(this.thirdPartyInsurance.insurance_specifications, Validators.required),
    responsibility: new FormControl(this.thirdPartyInsurance.responsibility, Validators.required),
    car_type: new FormControl(this.thirdPartyInsurance.type_car, Validators.required),
    car_numero_serie: new FormControl(this.thirdPartyInsurance.numero_serie, Validators.required),
    car_numero_structure: new FormControl(this.thirdPartyInsurance.numero_structure, Validators.required),
    car_numero_moteur: new FormControl(this.thirdPartyInsurance.numero_moteur, Validators.required),
    car_charge: new FormControl(this.thirdPartyInsurance.Charge, Validators.required),
    car_nb_passager: new FormControl(this.thirdPartyInsurance.nb_passager, Validators.required),
    car_annee_de_fabrication: new FormControl(this.thirdPartyInsurance.annee_de_fabrication.toString(), Validators.required),
    car_color: new FormControl(this.thirdPartyInsurance.couleur, Validators.required),
    car_pays_de_fabrication: new FormControl(this.thirdPartyInsurance.Pays_de_fabrication, Validators.required),
    car_orga_de_delivr: new FormControl(this.thirdPartyInsurance.Orga_de_delivr, Validators.required),
    insurance_value: new FormControl(this.thirdPartyInsurance.insurance_value, [Validators.required, Validators.min(0)]),
    endurance: new FormControl(this.thirdPartyInsurance.endurance, [Validators.required, Validators.min(0)]),
    initial: new FormControl(this.thirdPartyInsurance.initial, [Validators.required, Validators.min(0)]),
    taxe1: new FormControl(this.thirdPartyInsurance.taxe1, [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
    taxe2: new FormControl(this.thirdPartyInsurance.taxe2, [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
    taxe3: new FormControl(this.thirdPartyInsurance.taxe3, [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
    taxe4: new FormControl(this.thirdPartyInsurance.taxe4, [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
    total: new FormControl({value: this.thirdPartyInsurance.total, disabled: true}, [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
  })

  cards: Card[] = [
    {
      title: "معلومات عن التأمين",
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
            type: "text",
            label: "عنوان المأمن",
            hidden: false,
            formControlName: "address",
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
            label: "إسم السائق",
            hidden: false,
            formControlName: "driver_name",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "عنوان السائق",
            hidden: false,
            formControlName: "driver_address",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "tel",
            label: "رقم هاتف السائق",
            hidden: false,
            errorsMessages: {
              pattern: 'يجب أن يتكون رقم هاتف السائق من 10 أرقام',
            },
            formControlName: "driver_phone",
          }
        },
        {
          hasAction: 'yes',
          action: this.selectInsuranceType.bind(this),
          form: {
            type: "select",
            label: "نوع التأمين",
            hidden: false,
            formControlName: "insurance_type",
            selectOptions: data.obligatory_insurances.insuranceTypes,
            isObject: true
          }
        },
        {
          hasAction: 'yes',
          action: this.changeEndDate.bind(this),
          form: {
            type: 'date',
            label: 'تاريخ البداية',
            hidden: false,
            minDate: this.thirdPartyInsurance.startDate,
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
            minDate: this.thirdPartyInsurance.startDate,
            maxDate: DatesHelper.getDatePlusYears(50),
            formControlName: 'endDate',
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "select",
            label: "نوع الترخيص",
            hidden: false,
            formControlName: "permission_type",
            selectOptions: data.obligatory_insurances.permissions,
            isObject: false
          }

        },
        {
          hasAction: 'yes',
          action: this.calculateTax.bind(this),
          form: {
            type: "select",
            label: "مواصفاته",
            hidden: false,
            formControlName: "description",
            selectOptions: data.obligatory_insurances.descriptions,
            isObject: false
          }

        },
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "حدود المسؤلية",
            hidden: false,
            formControlName: "responsibility",
          }
        },
      ]
    },
    {
      title: "معلومات عن السيارة",
      fields: [
        {
          hasAction: 'no',
          form: {
            type: "select",
            label: "نوع السيارة",
            hidden: false,
            formControlName: "car_type",
            selectOptions: data.obligatory_insurances.carModels,
            isObject: false
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "رقم اللوحة",
            hidden: false,
            formControlName: "car_numero_serie",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "رقم الهيكل",
            hidden: false,
            formControlName: "car_numero_structure",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "رقم المحرك",
            hidden: false,
            formControlName: "car_numero_moteur",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "number",
            label: "الحمولة",
            hidden: false,
            formControlName: "car_charge",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "number",
            label: "عدد الركاب",
            hidden: false,
            formControlName: "car_nb_passager",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "select",
            label: "سنة الصنع",
            hidden: false,
            formControlName: "car_annee_de_fabrication",
            selectOptions: this.years,
            isObject: false
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "select",
            label: "اللون",
            hidden: false,
            formControlName: "car_color",
            selectOptions: data.obligatory_insurances.carColors,
            isObject: false
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "select",
            label: "بلد الصنع",
            hidden: false,
            formControlName: "car_pays_de_fabrication",
            selectOptions: this.dataService.countries,
            isObject: false
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "select",
            label: "جهة الترخيص",
            hidden: false,
            formControlName: "car_orga_de_delivr",
            selectOptions: data.global.libyanStates,
            isObject: false
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
            label: "مبلغ التأمين",
            hidden: false,
            formControlName: "insurance_value",
            errorsMessages: {
              min: 'يجب أن يكون مبلغ التأمين أكبر من 0',
            }
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "number",
            label: "التحمل",
            hidden: false,
            formControlName: "endurance",
            errorsMessages: {
              min: 'يجب أن يكون التحمل أكبر من 0',
            }
          }
        },
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
    title: "إضافة تأمين إجباري",
    formGroup: this.formGroup,
    cards: this.cards
  }


  selectInsuranceType() {
    if (this.myForm.formGroup.get('insurance_type')?.value !== '') {
      this.myForm.formGroup.get('startDate')?.setValue(moment())
      this.myForm.formGroup.get('startDate')?.enable()
      let id: number = this.myForm.formGroup.get('insurance_type')?.value
      let endDate = DatesHelper.getEndDateFromData(id, data.obligatory_insurances.insuranceTypes, this.myForm.formGroup.get('startDate')?.value)
      this.myForm.formGroup.get('endDate')?.setValue(endDate)
    }
  }

  changeEndDate() {
    let id: number = this.myForm.formGroup.get('insurance_type')?.value
    let endDate = DatesHelper.getEndDateFromData(id, data.obligatory_insurances.insuranceTypes, this.myForm.formGroup.get('startDate')?.value)
    this.myForm.formGroup.get('endDate')?.setValue(endDate)
  }


  ngOnInit() {
    //console.log(this.thirdPartyInsurance)
    for (let i = new Date().getFullYear(); i >= 1950; i--) {
      this.years.push(i.toString())
    }
    //console.log(this.myForm.formGroup)
    //this.myForm.formGroup.get('annee_de_fabrication')?.setValue(this.thirdPartyInsurance.annee_de_fabrication)
    this.dataService.fetchCountries()
  }


  calculateTax() {
    let taxes = TaxesHelper.calculateThirdPartInsuranceTax(this.myForm.formGroup.get('description')?.value)
    this.myForm.formGroup.get('initial')?.setValue(taxes.initial)
    this.myForm.formGroup.get('total')?.setValue(taxes.total)
  }


  updateThirdPartyInsurance(dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef._containerInstance._config.data.isLoading = true
    this.thirdPartyInsurance.name = this.myForm.formGroup.get('name')?.value
    this.thirdPartyInsurance.address = this.myForm.formGroup.get('address')?.value
    this.thirdPartyInsurance.phone = this.myForm.formGroup.get('phone')?.value
    this.thirdPartyInsurance.driver_name = this.myForm.formGroup.get('driver_name')?.value
    this.thirdPartyInsurance.driver_address = this.myForm.formGroup.get('driver_address')?.value
    this.thirdPartyInsurance.driver_phone = this.myForm.formGroup.get('driver_phone')?.value
    this.thirdPartyInsurance.insurance_type = this.myForm.formGroup.get('insurance_type')?.value
    this.thirdPartyInsurance.startDate = this.myForm.formGroup.get('startDate')?.value
    this.thirdPartyInsurance.endDate = this.myForm.formGroup.get('endDate')?.value
    this.thirdPartyInsurance.license_type = this.myForm.formGroup.get('permission_type')?.value
    this.thirdPartyInsurance.insurance_specifications = this.myForm.formGroup.get('description')?.value
    this.thirdPartyInsurance.responsibility = this.myForm.formGroup.get('responsibility')?.value
    this.thirdPartyInsurance.type_car = this.myForm.formGroup.get('car_type')?.value
    this.thirdPartyInsurance.numero_serie = this.myForm.formGroup.get('car_numero_serie')?.value
    this.thirdPartyInsurance.numero_structure = this.myForm.formGroup.get('car_numero_structure')?.value
    this.thirdPartyInsurance.numero_moteur = this.myForm.formGroup.get('car_numero_moteur')?.value
    this.thirdPartyInsurance.Charge = this.myForm.formGroup.get('car_charge')?.value
    this.thirdPartyInsurance.nb_passager = this.myForm.formGroup.get('car_nb_passager')?.value
    this.thirdPartyInsurance.annee_de_fabrication = parseInt(this.myForm.formGroup.get('car_annee_de_fabrication')?.value)
    this.thirdPartyInsurance.couleur = this.myForm.formGroup.get('car_color')?.value
    this.thirdPartyInsurance.Orga_de_delivr = this.myForm.formGroup.get('car_orga_de_delivr')?.value
    this.thirdPartyInsurance.Pays_de_fabrication = this.myForm.formGroup.get('car_pays_de_fabrication')?.value
    this.thirdPartyInsurance.insurance_value = this.myForm.formGroup.get('insurance_value')?.value
    this.thirdPartyInsurance.endurance = this.myForm.formGroup.get('endurance')?.value
    this.thirdPartyInsurance.initial = this.myForm.formGroup.get('initial')?.value
    this.thirdPartyInsurance.taxe1 = this.myForm.formGroup.get('taxe1')?.value
    this.thirdPartyInsurance.taxe2 = this.myForm.formGroup.get('taxe2')?.value
    this.thirdPartyInsurance.taxe3 = this.myForm.formGroup.get('taxe3')?.value
    this.thirdPartyInsurance.taxe4 = this.myForm.formGroup.get('taxe4')?.value
    this.thirdPartyInsurance.total = this.myForm.formGroup.get('total')?.value
    this.thirdPartyInsurance.userId = this.tokenStorageService.getUser().id
    this.thirdPartyInsuranceService.UpdateThirdPartyInsurance(this.thirdPartyInsurance).subscribe({
        next: () => {
          dialogRef._containerInstance._config.data.isLoading = false
          dialogRef.close()
          this.router.navigate(['/dashboard/thirdPartyInsurances'])
        }, error: (err) => {
          dialogRef._containerInstance._config.data.isLoading = false
          dialogRef.close()
          console.log(err);
        }
      }
    )
  }

  onSubmit() {
    if (!this.myForm.formGroup.pristine && this.myForm.formGroup.valid) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: "التأمينات الخاصة بالطرف الثالث",
          content: "هل تريد تعديل هذا التأمين الخاص بالطرف الثالث ؟",
          isLoading: false,
          onSubmit: () => this.updateThirdPartyInsurance(dialogRef)
        }, autoFocus: false, panelClass: 'choice-dialog-container'
      });

    }
  }
}
