import {Component, OnInit} from '@angular/core';
import * as Papa from 'papaparse';
import {Role} from 'src/app/public/enum/Role';
import {StorageService} from "../../../core/services/storage.service";
import {DataService} from "../../../core/services/data.service";
import {TravelInsuranceService} from "../../../core/services/travel-insurance.service";
import {HttpClient} from "@angular/common/http";
import {TravelInsurance} from "../../../public/models/travel-insurance.model";
import {ObligatoryInsuranceService} from "../../../core/services/obligatory-insurance.service";
import {ObligatoryInsurance} from "../../../public/models/obligatory-insurance.model";
import {Column} from "../../../public/shared/column";
import {User} from "../../../public/models/user.model";
import {FormControl, FormGroup} from "@angular/forms";
import {Card} from "../../../public/shared/card";
import {DatesHelper} from "../../../public/helpers/DatesHelper";
import {MyForm} from "../../../public/shared/my-form";
import {TablesHelper} from "../../../public/helpers/TablesHelper";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../../public/components/dialog/dialog.component";
import {ObjectsHelper} from "../../../public/helpers/ObjectsHelper";
import {isEmpty} from "rxjs";

@Component({
  selector: 'app-travel-insurance-report',
  templateUrl: './travel-insurance-report.component.html',
  styleUrls: ['./travel-insurance-report.component.scss']
})
export class TravelInsuranceReportComponent implements OnInit {

  actualUser = this.storageService.getUser()
  actualRole = this.actualUser.role
  officeCondition = this.actualRole === Role.Director || this.actualRole === Role.User
  userCondition = this.actualRole === Role.User
  showTable = 0
  total = 0
  isLoadingSearch = false

  constructor(protected data: DataService, private dialog: MatDialog, private travelInsuranceService: TravelInsuranceService, private storageService: StorageService) {
  }

  ngOnInit() {
    if (this.actualRole === Role.Director) {
      this.data.fetchUsersByOffice()
    } else if (this.actualRole === Role.Admin || this.actualRole === Role.Finance) {
      this.data.fetchOffices()
      this.data.fetchAllUsers()
    }
    this.data.fetchCountriesInEnglish()
  }

  travelInsurances: Array<TravelInsurance> = []

  tableColumns: Array<Column> = [
    {
      columnDef: 'id',
      header: 'No.',
      cell: (element: Record<string, number>) => `${this.travelInsurances.findIndex((obg) => obg.id === element['id']) + 1}`
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
    numero_passport: new FormControl(''),
    direction: new FormControl(''),
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
            label: "البحث برقم جواز السفر",
            hidden: false,
            formControlName: "numero_passport",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "select",
            label: "البحث بالوجهة",
            hidden: false,
            formControlName: "direction",
            selectOptions: this.data.countriesInEnglish,
            isObject: false
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
    title: "معلومات عن التأمين الخاص بالمسافرين",
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
    let numero_passport = this.myForm.formGroup.get("numero_passport")?.value
    let direction = this.myForm.formGroup.get("direction")?.value
    let startDate = this.myForm.formGroup.get("startDate")?.value
    let endDate = this.myForm.formGroup.get("endDate")?.value
    if (ObjectsHelper.isEmpty(bureauId) && ObjectsHelper.isEmpty(userId) && ObjectsHelper.isEmpty(numero_passport) && ObjectsHelper.isEmpty(direction) && ObjectsHelper.isEmpty(startDate) && ObjectsHelper.isEmpty(endDate)) {
      this.travelInsurances = []
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
        numero_passport: numero_passport !== '' ? numero_passport : null,
        direction: direction !== '' ? direction : null,
        startDate: startDate !== '' ? startDate : null,
        endDate: endDate !== '' ? endDate : null
      }
      this.travelInsuranceService.ReportTravelInsurance(request).subscribe({
        next: (Response) => {
          this.travelInsurances = Response
          this.travelInsurances.length > 0 ? this.showTable = 1 : this.showTable = -1
          this.total = TablesHelper.calculateSum(this.travelInsurances)
          this.isLoadingSearch = false
        }
      })
    }
  }

  /*csvData: any[] = [
    ['Name', 'Age', 'Email'],
    ['John Doe', 30, 'john@example.com'],
    ['Jane Smith', 25, 'jane@example.com']
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


  bureauId = -1;
  userId = -1
  numero_passport = ""
  startDate = ""
  endDate = ""
  direction = ""
  //numero_card = ""
  total = 0
  show: boolean = false
  protected readonly Role = Role;
  actualUser = this.tokenStorageService.getUser()
  travels: TravelInsurance[] = []
  //user:any="مالي"
  //user:any="مدير مكتب"
  constructor(private tokenStorageService: StorageService, protected data: DataService, private travelService:TravelInsuranceService, private http:HttpClient) {
  }

  ngOnInit() {
    this.getcountry()
    if (this.actualUser.role == Role.Director) {
      this.data.fetchUsersByOffice()
    }
    if (this.actualUser.role == Role.Admin || this.actualUser.role == Role.Finance) {
      this.data.fetchOffices()
    }
  }

  pays:any;
  getcountry(){
    this.http.get('https://restcountries.com/v3.1/all?lang=ar')
      .subscribe(
        (data: any) => {
          this.pays = [];
          for (let index = 0; index < data.length; index++) {
            this.pays.push( data[index].translations.ara.common);
          }
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  search() {
    let request = {
      bureauId: this.actualUser.role===Role.Director && this.bureauId === -1 ? this.actualUser.bureauId : this.bureauId === -1 ? null : this.bureauId,
      userId: this.actualUser.role === Role.User && this.userId === -1 ? this.actualUser.id : this.userId === -1 ? null : this.userId,
      numero_passport: this.numero_passport === "" ? null : this.numero_passport,
      direction: this.direction === "إختر الوجهة" || this.direction === "" ? null : this.direction,
      startDate: this.startDate === "" ? null : this.startDate,
      endDate: this.endDate === "" ? null : this.endDate
    }
    this.travelService.ReportTravelInsurance(request).subscribe((Response) => {
      this.travels = Response
      this.total = this.travels.reduce((a, b) => a + b.total, 0)
      this.show = true
    })
  }*/
}
