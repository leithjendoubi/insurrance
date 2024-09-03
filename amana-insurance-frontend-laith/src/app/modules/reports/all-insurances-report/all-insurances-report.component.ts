import {Component, OnInit} from '@angular/core';
import * as Papa from 'papaparse';
import {Role} from 'src/app/public/enum/Role';
import {StorageService} from "../../../core/services/storage.service";
import {DataService} from "../../../core/services/data.service";
import {PersonHealthInsuranceService} from "../../../core/services/person-health-insurance.service";
import {GroupHealthInsuranceService} from "../../../core/services/group-health-insurance.service";
import {ObligatoryInsuranceService} from "../../../core/services/obligatory-insurance.service";
import {TravelInsuranceService} from "../../../core/services/travel-insurance.service";
import {ThirdPartyInsuranceService} from "../../../core/services/third-party-insurance.service";
import {Insurance} from "../../../public/models/insurance.model";
import {TablesHelper} from "../../../public/helpers/TablesHelper";
import {MatDialog} from "@angular/material/dialog";
import {ObligatoryInsurance} from "../../../public/models/obligatory-insurance.model";
import {Column} from "../../../public/shared/column";
import {User} from "../../../public/models/user.model";
import {FormControl, FormGroup} from "@angular/forms";
import {Card} from "../../../public/shared/card";
import {DatesHelper} from "../../../public/helpers/DatesHelper";
import {MyForm} from "../../../public/shared/my-form";
import {ObjectsHelper} from "../../../public/helpers/ObjectsHelper";
import {DialogComponent} from "../../../public/components/dialog/dialog.component";
import moment from "moment";

@Component({
  selector: 'app-all-insurances-report',
  templateUrl: './all-insurances-report.component.html',
  styleUrls: ['./all-insurances-report.component.scss']
})
export class AllInsurancesReportComponent implements OnInit {
  actualUser = this.storageService.getUser()
  actualRole = this.actualUser.role
  officeCondition = this.actualRole === Role.Director || this.actualRole === Role.User
  userCondition = this.actualRole === Role.User
  showTable = 0
  total = 0
  isLoadingSearch = false

  constructor(protected data: DataService, private dialog: MatDialog, private obligatoryInsuranceService: ObligatoryInsuranceService,
              private personHealthInsuranceService: PersonHealthInsuranceService,private groupHealthInsuranceService:GroupHealthInsuranceService,
              private travelInsuranceService:TravelInsuranceService,private thirdInsuranceService:ThirdPartyInsuranceService
              ,private storageService: StorageService) {
  }

  ngOnInit() {
    if (this.actualRole === Role.Director) {
      this.data.fetchUsersByOffice()
    } else if (this.actualRole === Role.Admin || this.actualRole === Role.Finance) {
      this.data.fetchOffices()
      this.data.fetchAllUsers()
    }
  }

  insurances: Array<Insurance> = []

  tableColumns: Array<Column> = [
    {
      columnDef: 'id',
      header: 'No.',
      cell: (element: Record<string, number | string>) => `${this.insurances.findIndex((ins) => ins.id === element['id'] && ins.type === element['type']) + 1}`
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
    {columnDef: 'startDate', header: 'التغطية من', cell: (element: Record<string, Date>) => `${moment(element['startDate']).format('LL')}`},
    {columnDef: 'endDate', header: 'إلى', cell: (element: Record<string, Date>) => `${moment(element['endDate']).format('LL')}`},
    {columnDef: 'type', header: 'نوعية التأمين', cell: (element: Record<string, String>) => `${element['type']}`},
    {columnDef: 'initial', header: 'القسط الصافي', cell: (element: Record<string, number>) => `${element['initial']}`},
    {columnDef: 'taxe1', header: 'الضريبة', cell: (element: Record<string, number>) => `${element['taxe1']}`},
    {columnDef: 'taxe2', header: 'الدمغة', cell: (element: Record<string, number>) => `${element['taxe2']}`},
    {columnDef: 'taxe3', header: 'الإشراف و الرقابة', cell: (element: Record<string, number>) => `${element['taxe3'] ? element['taxe3'] : 'لا يوجد'}`},
    {columnDef: 'taxe4', header: 'م الإصدار', cell: (element: Record<string, number>) => `${element['taxe4']}`},
    {columnDef: 'total', header: 'المبلغ الإجمالي', cell: (element: Record<string, number>) => `${element['total']}`},
  ];

  formGroup = new FormGroup({
    officeId: new FormControl({
      value: this.officeCondition ? this.actualUser.bureauId : "",
      disabled: this.officeCondition
    }),
    userId: new FormControl({value: this.userCondition ? this.actualUser.id : "", disabled: this.userCondition}),
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
    title: "معلومات عن كل التأمينات",
    formGroup: this.formGroup,
    cards: this.cards,
  }

  changeMinEndDate() {
    if (this.myForm.cards[0].fields[3].form.type === 'date') {
      this.myForm.formGroup.get('endDate')?.setValue('')
      this.myForm.cards[0].fields[3].form.minDate = new Date(this.formGroup.get('startDate')?.value as string)
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
    let startDate = this.myForm.formGroup.get("startDate")?.value
    let endDate = this.myForm.formGroup.get("endDate")?.value
    if (ObjectsHelper.isEmpty(bureauId) && ObjectsHelper.isEmpty(userId) && ObjectsHelper.isEmpty(startDate) && ObjectsHelper.isEmpty(endDate)) {
      this.insurances = []
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
        startDate: startDate !== '' ? startDate : null,
        endDate: endDate !== '' ? endDate : null
      }
      this.insurances=[]
      this.obligatoryInsuranceService.ReportObligatoryInsurance(request).subscribe((Response1) => {
        this.travelInsuranceService.ReportTravelInsurance(request).subscribe((Response2) => {
          this.thirdInsuranceService.ReportThirdPartyInsurance(request).subscribe((Response3) => {
            this.personHealthInsuranceService.ReportPersonHealthInsurance(request).subscribe((Response4) => {
              this.groupHealthInsuranceService.ReportGroupHealthInsurance(request).subscribe((Response5) => {
                this.insurances.push(...Response1, ...Response2, ...Response3, ...Response4, ...Response5)
                TablesHelper.sortTable(this.insurances)
                this.insurances.length > 0 ? this.showTable = 1 : this.showTable = -1
                this.total = TablesHelper.calculateSum(this.insurances)
                this.isLoadingSearch = false
              })
            })
          })
        })
      })
    }
  }

  /*csvData: any[] = [
    ['Name', 'Age', 'Email'],
    ['John Doe', 30, 'john@example.com'],
    ['Jane Smith', 25, 'jane@example.com']
    // Add more data as needed
  ];

  downloadCSV() {
    const csv = Papa.unparse(this.csvData);
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }


  bureauId: number = -1
  userId: number = -1
  numero_strcture: any
  startDate: any
  endDate: any
  total = 0
  actualUser = this.tokenStorageService.getUser()
  assurances: Insurance[] = []
  protected readonly Role = Role;
  show: boolean = false

  constructor(private tokenStorageService: StorageService, protected data: DataService, private assuranceObligatoireService: ObligatoryInsuranceService,
              private assuranceSantePersonneService: PersonHealthInsuranceService, private assuranceSanteGroupeService: GroupHealthInsuranceService,
              private assuranceTravelService:TravelInsuranceService, private thirdInsuranceService:ThirdPartyInsuranceService
              ) {
  }

  ngOnInit() {
    if (this.actualUser.role == Role.Director) {
      this.data.fetchUsersByOffice()
    }
    if (this.actualUser.role == Role.Admin || this.actualUser.role == Role.Finance) {
      this.data.fetchOffices()
    }
  }

  search() {
    let request = {
      bureauId: this.actualUser.role===Role.Director && this.bureauId === -1 ? this.actualUser.bureauId : this.bureauId === -1 ? null : this.bureauId,
      userId: this.actualUser.role === Role.User && this.userId === -1 ? this.actualUser.id : this.userId === -1 ? null : this.userId,
      startDate: this.startDate === "" ? null : this.startDate,
      endDate: this.endDate === "" ? null : this.endDate
    }
    this.assurances = []
    this.assuranceObligatoireService.ReportObligatoryInsurance(request).subscribe((Response1) => {
      this.assuranceTravelService.ReportTravelInsurance(request).subscribe((Response2) => {
        this.thirdInsuranceService.ReportThirdPartyInsurance(request).subscribe((Response3) => {
          this.assuranceSantePersonneService.ReportPersonHealthInsurance(request).subscribe((Response4) => {
            this.assuranceSanteGroupeService.ReportGroupHealthInsurance(request).subscribe((Response5) => {
              this.assurances.push(...Response1, ...Response2, ...Response3, ...Response4, ...Response5)
              TablesHelper.sortTable(this.assurances)
              this.total = this.assurances.reduce((a, b) => a + b.total, 0)
              this.show = true
            })
          })
        })
      })
    })
  }*/
}
