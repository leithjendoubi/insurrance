import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ObligatoryInsuranceService} from "../../../../core/services/obligatory-insurance.service";
import {StorageService} from "../../../../core/services/storage.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Card} from "../../../../public/shared/card";
import data from "../../../../public/data";
import {MyForm} from "../../../../public/shared/my-form";
import moment from "moment/moment";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DataService} from "../../../../core/services/data.service";
import {DialogComponent} from "../../../../public/components/dialog/dialog.component";
import {DatesHelper} from "../../../../public/helpers/DatesHelper";
import {TaxesHelper} from "../../../../public/helpers/TaxesHelper";
import {ObligatoryInsurance} from "../../../../public/models/obligatory-insurance.model";

@Component({
    selector: 'app-update-obligatory-insurance',
    templateUrl: './update-obligatory-insurance.component.html',
    styleUrls: ['./update-obligatory-insurance.component.scss']
})
export class UpdateObligatoryInsuranceComponent {
    actualUser = this.tokenStorageService.getUser()
    obligatoryInsurance = history.state?.data as ObligatoryInsurance
    years: string[] = []
    type = data.obligatory_insurances.insuranceTypes.find((row)=> row.name === this.obligatoryInsurance.insurance_type)?.id as number

    formGroup = new FormGroup({
        name: new FormControl(this.obligatoryInsurance.name, Validators.required),
        address: new FormControl(this.obligatoryInsurance.address, Validators.required),
        phone: new FormControl(this.obligatoryInsurance.phone, [Validators.required, Validators.pattern('[0-9]{10}$')]),
        insurance_type: new FormControl(this.type, Validators.required),
        startDate: new FormControl(this.obligatoryInsurance.startDate, Validators.required),
        endDate: new FormControl({value: this.obligatoryInsurance.endDate, disabled: true}, Validators.required),
        permission_type: new FormControl(this.obligatoryInsurance.license_type, Validators.required),
        description: new FormControl(this.obligatoryInsurance.assurance_specifications, Validators.required),
        car_type: new FormControl(this.obligatoryInsurance.type_car, Validators.required),
        car_numero_serie: new FormControl(this.obligatoryInsurance.numero_serie, Validators.required),
        car_numero_structure: new FormControl(this.obligatoryInsurance.numero_structure, Validators.required),
        car_numero_moteur: new FormControl(this.obligatoryInsurance.numero_moteur, Validators.required),
        car_charge: new FormControl(this.obligatoryInsurance.Charge, Validators.required),
        car_nb_passager: new FormControl(this.obligatoryInsurance.nb_passager, Validators.required),
        car_annee_de_fabrication: new FormControl(this.obligatoryInsurance.annee_de_fabrication.toString(), Validators.required),
        car_color: new FormControl(this.obligatoryInsurance.couleur, Validators.required),
        car_orga_de_delivr: new FormControl(this.obligatoryInsurance.Orga_de_delivr, Validators.required),
        car_pays_de_fabrication: new FormControl(this.obligatoryInsurance.Pays_de_fabrication, Validators.required),
        initial: new FormControl(this.obligatoryInsurance.initial, [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
        taxe1: new FormControl(this.obligatoryInsurance.taxe1, [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
        taxe2: new FormControl(this.obligatoryInsurance.taxe2, [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
        taxe3: new FormControl(this.obligatoryInsurance.taxe3, [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
        taxe4: new FormControl(this.obligatoryInsurance.taxe4, [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
        total: new FormControl({value: this.obligatoryInsurance.total, disabled: true}, [Validators.required, Validators.min(0)/*, Validators.max(100)*/]),
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
                    hasAction: 'yes',
                    action: this.selectInsurance.bind(this),
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
                        minDate: this.obligatoryInsurance.startDate,
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
                        minDate: this.obligatoryInsurance.startDate,
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

                }
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
        title: "تعديل تأمين إجباري",
        formGroup: this.formGroup,
        cards: this.cards
    }


    selectInsurance() {
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

    constructor(private obligatoryInsuranceService: ObligatoryInsuranceService, private dialog: MatDialog, private tokenStorageService: StorageService, private router: Router, private dataService: DataService) {
    }

    ngOnInit() {
        for (let i = new Date().getFullYear(); i >= 1950; i--) {
            this.years.push(i.toString())
        }
        this.dataService.fetchCountries()
    }




    calculateTax() {
        let taxes = TaxesHelper.calculateObligatoryInsuranceTax(this.myForm.formGroup.get('description')?.value)
        this.myForm.formGroup.get('initial')?.setValue(taxes.initial)
        this.myForm.formGroup.get('total')?.setValue(taxes.total)
    }


    updateObligatoryInsurance(dialogRef: MatDialogRef<DialogComponent>) {
        dialogRef.componentInstance.data.isLoading = true
        this.obligatoryInsurance.name = this.myForm.formGroup.get('name')?.value
        this.obligatoryInsurance.address = this.myForm.formGroup.get('address')?.value
        this.obligatoryInsurance.phone = this.myForm.formGroup.get('phone')?.value
        this.obligatoryInsurance.insurance_type = data.obligatory_insurances.insuranceTypes.find((row)=> row.id === this.myForm.formGroup.get('insurance_type')?.value)?.name as string
        this.obligatoryInsurance.startDate = this.myForm.formGroup.get('startDate')?.value
        this.obligatoryInsurance.endDate = this.myForm.formGroup.get('endDate')?.value
        this.obligatoryInsurance.license_type = this.myForm.formGroup.get('permission_type')?.value
        this.obligatoryInsurance.assurance_specifications = this.myForm.formGroup.get('description')?.value
        this.obligatoryInsurance.type_car = this.myForm.formGroup.get('car_type')?.value
        this.obligatoryInsurance.numero_serie = this.myForm.formGroup.get('car_numero_serie')?.value
        this.obligatoryInsurance.numero_structure = this.myForm.formGroup.get('car_numero_structure')?.value
        this.obligatoryInsurance.numero_moteur = this.myForm.formGroup.get('car_numero_moteur')?.value
        this.obligatoryInsurance.Charge = this.myForm.formGroup.get('car_charge')?.value
        this.obligatoryInsurance.nb_passager = this.myForm.formGroup.get('car_nb_passager')?.value
        this.obligatoryInsurance.annee_de_fabrication = parseInt(this.myForm.formGroup.get('car_annee_de_fabrication')?.value)
        this.obligatoryInsurance.couleur = this.myForm.formGroup.get('car_color')?.value
        this.obligatoryInsurance.Orga_de_delivr = this.myForm.formGroup.get('car_orga_de_delivr')?.value
        this.obligatoryInsurance.Pays_de_fabrication = this.myForm.formGroup.get('car_pays_de_fabrication')?.value
        this.obligatoryInsurance.initial = this.myForm.formGroup.get('initial')?.value
        this.obligatoryInsurance.taxe1 = this.myForm.formGroup.get('taxe1')?.value
        this.obligatoryInsurance.taxe2 = this.myForm.formGroup.get('taxe2')?.value
        this.obligatoryInsurance.taxe3 = this.myForm.formGroup.get('taxe3')?.value
        this.obligatoryInsurance.taxe4 = this.myForm.formGroup.get('taxe4')?.value
        this.obligatoryInsurance.total = this.myForm.formGroup.get('total')?.value
        this.obligatoryInsurance.userId = this.tokenStorageService.getUser().id
        this.obligatoryInsuranceService.UpdateObligatoryInsurance(this.obligatoryInsurance).subscribe({
                next: () => {
                    dialogRef.componentInstance.data.isLoading = false
                    dialogRef.close()
                    this.router.navigate(['/dashboard/obligatoryInsurances'])
                }, error: (err) => {
                    dialogRef.componentInstance.data.isLoading = false
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
                    title: "التأمينات الإجبارية",
                    content: "هل تريد تعديل هذا التأمين الإجباري ؟",
                    isLoading: false,
                    onSubmit: () => this.updateObligatoryInsurance(dialogRef)
                }, autoFocus: false, panelClass: 'choice-dialog-container'
            });
        }
    }

}
