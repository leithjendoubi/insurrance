import {Component, OnInit} from '@angular/core';
import * as Papa from 'papaparse';
import {Role} from 'src/app/public/enum/Role';
import {StorageService} from "../../../core/services/storage.service";
import {DataService} from "../../../core/services/data.service";
import {GroupHealthInsuranceService} from "../../../core/services/group-health-insurance.service";
import {PersonHealthInsuranceService} from "../../../core/services/person-health-insurance.service";
import {HealthInsurance} from "../../../public/models/health-insurance.model";
import {TablesHelper} from "../../../public/helpers/TablesHelper";
import {TravelInsuranceService} from "../../../core/services/travel-insurance.service";
import {TravelInsurance} from "../../../public/models/travel-insurance.model";
import {Column} from "../../../public/shared/column";
import {User} from "../../../public/models/user.model";
import {FormControl, FormGroup} from "@angular/forms";
import {Card} from "../../../public/shared/card";
import {DatesHelper} from "../../../public/helpers/DatesHelper";
import {MyForm} from "../../../public/shared/my-form";
import data from "../../../public/data";
import {GroupHealthInsurance} from "../../../public/models/group-health-insurance.model";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../../public/components/dialog/dialog.component";
import {ObjectsHelper} from "../../../public/helpers/ObjectsHelper";

@Component({
  selector: 'app-health-insurance-report',
  templateUrl: './health-insurance-report.component.html',
  styleUrls: ['./health-insurance-report.component.scss']
})
export class HealthInsuranceReportComponent implements OnInit {

  actualUser = this.storageService.getUser()
  actualRole = this.actualUser.role
  officeCondition = this.actualRole === Role.Director || this.actualRole === Role.User
  userCondition = this.actualRole === Role.User
  showTable = 0
  total = 0
  isLoadingSearch = false

  constructor(protected dataService: DataService,private dialog:MatDialog, private groupHealthInsuranceService: GroupHealthInsuranceService, private personHealthInsuranceService: PersonHealthInsuranceService, private storageService: StorageService) {
  }

  ngOnInit() {
    if (this.actualRole === Role.Director) {
      this.dataService.fetchUsersByOffice()
    } else if (this.actualRole === Role.Admin || this.actualRole === Role.Finance) {
      this.dataService.fetchOffices()
      this.dataService.fetchAllUsers()
    }
    this.dataService.fetchCountriesInEnglish()
  }

  healthInsurances: Array<HealthInsurance> = []

  tableColumns: Array<Column> = [
    {
      columnDef: 'id',
      header: 'No.',
      cell: (element: Record<string, number>) => `${this.healthInsurances.findIndex((obg) => obg.id === element['id']) + 1}`
    },
    {columnDef: 'name', header: 'إسم (العميل/الجهة)', cell: (element: Record<string, string>) => `${element['name']}`},
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
    type: new FormControl(''),
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
            selectOptions: this.officeCondition ? [this.actualUser.bureau] : this.dataService.offices,
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
            selectOptions: this.userCondition ? [this.actualUser] : this.actualRole === Role.Director ? this.dataService.officeUsers : this.dataService.allUsers,
            isObject: true
          }
        },
        {
          hasAction: 'no',
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
    title: "معلومات عن التأمين الصحي",
    formGroup: this.formGroup,
    cards: this.cards,
  }

  changeMinEndDate() {
    if (this.myForm.cards[0].fields[4].form.type === 'date') {
      this.myForm.formGroup.get('endDate')?.setValue('')
      this.myForm.cards[0].fields[4].form.minDate = new Date(this.formGroup.get('startDate')?.value as string)
    }
  }

  changeOfficeUsers() {
    let officeId = parseInt(this.formGroup.get('officeId')?.value as string)
    if (officeId) {
      this.dataService.fetchUsersBySelectedOffice(officeId)
      if (this.myForm.cards[0].fields[1].form.type === 'select') {
        this.myForm.cards[0].fields[1].form.selectOptions = this.dataService.selectedOfficeUsers
      }
    }
    else{
      this.dataService.fetchAllUsers()
      if (this.myForm.cards[0].fields[1].form.type === 'select') {
        this.myForm.cards[0].fields[1].form.selectOptions = this.dataService.allUsers
      }
    }
  }


  onSubmit() {
    let bureauId = this.myForm.formGroup.get("officeId")?.value
    let userId = this.myForm.formGroup.get("userId")?.value
    let type = this.myForm.formGroup.get("type")?.value
    let startDate = this.myForm.formGroup.get("startDate")?.value
    let endDate = this.myForm.formGroup.get("endDate")?.value


    if(ObjectsHelper.isEmpty(bureauId) && ObjectsHelper.isEmpty(userId) && ObjectsHelper.isEmpty(startDate) && ObjectsHelper.isEmpty(endDate) && ObjectsHelper.isEmpty(type)){
      this.healthInsurances=[]
      this.showTable = this.total = 0
      this.dialog.open(DialogComponent,{
        data:{
            type:'info',
            title:this.myForm.title,
            content:'لا يوجد بيانات للبحث'

        }
      })
    }

    else{
      this.isLoadingSearch = true
      let request = {
        bureauId: bureauId !== '' ? bureauId : null,
        userId: userId !== '' ? userId : null,
        startDate: startDate !== '' ? startDate : null,
        endDate: endDate !== '' ? endDate : null
      }
      if (type !== "") {
        if (type === "صحي مجموعات") {
          this.groupHealthInsuranceService.ReportGroupHealthInsurance(request).subscribe({
            next: (Response) => {
              this.healthInsurances=Response
              this.healthInsurances.length > 0 ? this.showTable = 1 : this.showTable = -1
              this.total = TablesHelper.calculateSum(this.healthInsurances)
              this.isLoadingSearch = false
            }
          })
        } else {
          this.personHealthInsuranceService.ReportPersonHealthInsurance(request).subscribe({
            next: (Response) => {
              this.healthInsurances = Response
              this.healthInsurances.length > 0 ? this.showTable = 1 : this.showTable = -1
              this.total = TablesHelper.calculateSum(this.healthInsurances)
              this.isLoadingSearch = false
            }
          })
        }
      } else {

        this.groupHealthInsuranceService.ReportGroupHealthInsurance(request).subscribe({
          next: (Response1) => {
            this.personHealthInsuranceService.ReportPersonHealthInsurance(request).subscribe({
              next:(Response2) => {
                this.healthInsurances = []
                this.healthInsurances.push(...Response1, ...Response2)
                TablesHelper.sortTable(this.healthInsurances)
                this.healthInsurances.length > 0 ? this.showTable = 1 : this.showTable = -1
                this.total = TablesHelper.calculateSum(this.healthInsurances)
                this.isLoadingSearch = false
              }
            })
          }
        })
      }
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
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }}



  bureauId = -1;
  userId = -1
  type = ""
  startDate = ""
  endDate = ""
  numero_passport = ""
  nom = ""
  total = 0
  show: boolean = false
  actualUser = this.tokenStorageService.getUser()
  assurances: HealthInsurance[] = []


  protected readonly Role = Role;
  //user:any="مالي"
  //user:any="مدير مكتب"
  constructor (private tokenStorageService:StorageService, protected data:DataService, private assuranceSanteGroupe:GroupHealthInsuranceService, private assuranceSantePersonne:PersonHealthInsuranceService) {}

  ngOnInit() {
    if (this.actualUser.role == Role.Director) {
      this.data.fetchUsersByOffice()
    }
    if (this.actualUser.role == Role.Admin || this.actualUser.role == Role.Finance) {
      this.data.fetchOffices()
    }
  }
  search(){
    let request = {
      bureauId: this.actualUser.role===Role.Director && this.bureauId === -1 ? this.actualUser.bureauId : this.bureauId === -1 ? null : this.bureauId,
      userId: this.actualUser.role === Role.User && this.userId === -1 ? this.actualUser.id : this.userId === -1 ? null : this.userId,
      type: this.type === "" ? null : this.type,
      //numero_passport: this.numero_passport === "" ? null : this.numero_passport,
      //nom:this.nom==="" ? null : this.nom,
      startDate: this.startDate === "" ? null : this.startDate,
      endDate: this.endDate === "" ? null : this.endDate
    }
    this.assurances=[]
    if(this.type!=""){
      if(this.type==="صحي مجموعات"){
        this.assuranceSanteGroupe.ReportGroupHealthInsurance(request).subscribe((Response) => {
          this.assurances = Response
          this.total = this.assurances.reduce((a, b) => a + b.total, 0)
          this.show = true
        })
      }
      else{
        this.assuranceSantePersonne.ReportPersonHealthInsurance(request).subscribe((Response) => {
          this.assurances = Response
          this.total = this.assurances.reduce((a, b) => a + b.total, 0)
          this.show = true
        })
      }
    }
    else{
      this.assuranceSanteGroupe.ReportGroupHealthInsurance(request).subscribe((Response1) => {
        this.assuranceSantePersonne.ReportPersonHealthInsurance(request).subscribe((Response2) => {
          this.assurances.push(...Response1,...Response2)
          TablesHelper.sortTable(this.assurances)
          this.total = this.assurances.reduce((a, b) => a + b.total, 0)
          this.show = true
        })
      })
    }
    this.show=true
  }*/
}
