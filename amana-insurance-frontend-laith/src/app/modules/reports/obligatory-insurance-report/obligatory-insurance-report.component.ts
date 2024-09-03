import {Component, OnInit} from '@angular/core';
import {Role} from 'src/app/public/enum/Role';
import {StorageService} from "../../../core/services/storage.service";
import {DataService} from "../../../core/services/data.service";
import {ObligatoryInsuranceService} from "../../../core/services/obligatory-insurance.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Card} from "../../../public/shared/card";
import {MyForm} from "../../../public/shared/my-form";
import {Office} from "../../../public/models/office.model";
import {User} from "../../../public/models/user.model";
import {DatesHelper} from "../../../public/helpers/DatesHelper";
import {Column} from "../../../public/shared/column";
import {ObligatoryInsurance} from "../../../public/models/obligatory-insurance.model";
import Papa from 'papaparse';
import {TablesHelper} from "../../../public/helpers/TablesHelper";
import {DialogComponent} from "../../../public/components/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ObjectsHelper} from "../../../public/helpers/ObjectsHelper";


@Component({
  selector: 'app-obligatory-insurance-report',
  templateUrl: './obligatory-insurance-report.component.html',
  styleUrls: ['./obligatory-insurance-report.component.scss']
})
export class ObligatoryInsuranceReportComponent implements OnInit {

  actualUser = this.storageService.getUser()
  actualRole = this.actualUser.role
  officeCondition = this.actualRole === Role.Director || this.actualRole === Role.User
  userCondition = this.actualRole === Role.User
  showTable = 0
  total = 0
  isLoadingSearch = false

  constructor(protected data: DataService,private dialog:MatDialog, private obligatoryInsuranceService: ObligatoryInsuranceService, private storageService: StorageService) {
  }

  ngOnInit() {
    if (this.actualRole === Role.Director) {
      this.data.fetchUsersByOffice()
    } else if (this.actualRole === Role.Admin || this.actualRole === Role.Finance) {
      this.data.fetchOffices()
      this.data.fetchAllUsers()
    }
  }

  obligatoryInsurances: Array<ObligatoryInsurance> = []

  tableColumns: Array<Column> = [
    {
      columnDef: 'id',
      header: 'No.',
      cell: (element: Record<string, number>) => `${this.obligatoryInsurances.findIndex((obg) => obg.id === element['id']) + 1}`
    },
    {columnDef: 'name', header: 'إسم العميل', cell: (element: Record<string, string>) => `${element['name']}`},
    {
      columnDef: 'username',
      header: 'أضيفت بواسطة',
      cell: (element: Record<string, User>) => `${element['user'].username}`
    },
    {
      columnDef: 'office',
      header: 'إسم المكتب',
      cell: (element: Record<string, User>) => `${element['user'].bureau != null ? element['user'].bureau.name : 'إدارة مكاتب'}`
    },
    {columnDef: 'startDate', header: 'التغطية من', cell: (element: Record<string, Date>) => `${element['startDate']}`},
    {columnDef: 'endDate', header: 'إلى', cell: (element: Record<string, Date>) => `${element['endDate']}`},
    {columnDef: 'initial', header: 'القسط الصافي', cell: (element: Record<string, number>) => `${element['initial']}`},
    {columnDef: 'taxe1', header: 'الضريبة', cell: (element: Record<string, number>) => `${element['taxe1']}`},
    {columnDef: 'taxe2', header: 'الدمغة', cell: (element: Record<string, number>) => `${element['taxe2']}`},
    {columnDef: 'taxe3', header: 'الإشراف و الرقابة', cell: (element: Record<string, number>) => `${element['taxe3']}`},
    {columnDef: 'taxe4', header: 'م الإصدار', cell: (element: Record<string, number>) => `${element['taxe4']}`},
    {columnDef: 'total', header: 'المبلغ الإجمالي', cell: (element: Record<string, number>) => `${element['total']}`},
  ];

  formGroup = new FormGroup({
    officeId: new FormControl({
      value: this.officeCondition ? this.actualUser.bureauId : "",
      disabled: this.officeCondition
    }),
    userId: new FormControl({value: this.userCondition ? this.actualUser.id : "", disabled: this.userCondition}),
    numero_structure: new FormControl(''),
    numero_serie: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  cards: Card[] = [
    {
      title: "",
      fields: [
        {
          hasAction: 'yes',
          action: this.changeOfficeUsers.bind(this),
          form: {
            type: "select",
            label: "البحث بإسم المكتب",
            hidden: false,
            formControlName: "officeId",
            selectOptions: this.officeCondition ? [this.actualUser.bureau] : this.data.offices,
            isObject: true
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "select",
            label: "البحث بإسم المستخدم",
            hidden: false,
            formControlName: "userId",
            selectOptions: this.userCondition ? [this.actualUser] : this.actualRole === Role.Director ? this.data.officeUsers : this.data.allUsers,
            isObject: true
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "البحث برقم الهيكل",
            hidden: false,
            formControlName: "numero_structure",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "البحث برقم اللوحة",
            hidden: false,
            formControlName: "numero_serie",
          }
        },
        {
          hasAction: 'yes',
          action: this.changeMinEndDate.bind(this),
          form: {
            type: 'date',
            label: 'إختر تاريخ ما بين',
            hidden: false,
            minDate: DatesHelper.getDatePlusYears(-100),
            maxDate: DatesHelper.getDatePlusYears(100),
            formControlName: 'startDate',
          }
        },
        {
          hasAction: 'no',
          form: {
            type: 'date',
            label: 'الى التاريخ',
            hidden: false,
            minDate: DatesHelper.getDatePlusYears(-100),
            maxDate: DatesHelper.getDatePlusYears(100),
            formControlName: 'endDate',
          }
        }]
    }]

  myForm: MyForm = {
    title: "معلومات عن التأمين إجباري",
    formGroup: this.formGroup,
    cards: this.cards,
  }

  changeMinEndDate() {
    if (this.myForm.cards[0].fields[5].form.type === 'date') {
      this.myForm.formGroup.get('endDate')?.setValue('')
      this.myForm.cards[0].fields[5].form.minDate = new Date(this.formGroup.get('startDate')?.value as string)
    }
  }

  changeOfficeUsers() {
    let officeId = parseInt(this.formGroup.get('officeId')?.value as string)
    if (officeId) {
      this.data.fetchUsersBySelectedOffice(officeId)
      if (this.myForm.cards[0].fields[1].form.type === 'select') {
        this.myForm.cards[0].fields[1].form.selectOptions = this.data.selectedOfficeUsers
      }
    } else {
      this.data.fetchAllUsers()
      if (this.myForm.cards[0].fields[1].form.type === 'select') {
        this.myForm.cards[0].fields[1].form.selectOptions = this.data.allUsers
      }
    }
  }

  onSubmit() {
    let bureauId = this.myForm.formGroup.get("officeId")?.value
    let userId = this.myForm.formGroup.get("userId")?.value
    let numero_structure = this.myForm.formGroup.get("numero_structure")?.value
    let numero_serie = this.myForm.formGroup.get("numero_serie")?.value
    let startDate = this.myForm.formGroup.get("startDate")?.value
    let endDate = this.myForm.formGroup.get("endDate")?.value
    if (ObjectsHelper.isEmpty(bureauId) && ObjectsHelper.isEmpty(userId) && ObjectsHelper.isEmpty(numero_structure) && ObjectsHelper.isEmpty(numero_serie) && ObjectsHelper.isEmpty(startDate) && ObjectsHelper.isEmpty(endDate)) {
      this.obligatoryInsurances=[]
      this.showTable = this.total = 0
      this.dialog.open(DialogComponent, {
        data: {
          type: 'info',
          title: this.myForm.title,
          content: 'لا يوجد بيانات للبحث'

        }
      })
    } else {
      this.isLoadingSearch = true
      let request = {
        bureauId: bureauId !== '' ? bureauId : null,
        userId: userId !== '' ? userId : null,
        numero_structure: numero_structure !== '' ? numero_structure : null,
        numero_serie: numero_serie !== '' ? numero_serie : null,
        startDate: startDate !== '' ? startDate : null,
        endDate: endDate !== '' ? endDate : null
      }
      this.obligatoryInsuranceService.ReportObligatoryInsurance(request).subscribe({
        next: (Response) => {
          this.obligatoryInsurances = Response
          this.obligatoryInsurances.length > 0 ? this.showTable = 1 : this.showTable = -1
          this.total = TablesHelper.calculateSum(this.obligatoryInsurances)
          this.isLoadingSearch = false
        }
      })
    }
  }


}
