import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginAmanaComponent} from './modules/auth/login-amana/login-amana.component';
import {ObligatoryInsurancesTabComponent} from './modules/insurances/obligatory-insurances/obligatory-insurances-tab/obligatory-insurances-tab.component';
import {DashboardComponent} from './modules/dashboard/dashboard.component';
import {UpdateObligatoryInsuranceComponent} from './modules/insurances/obligatory-insurances/update-obligatory-insurance/update-obligatory-insurance.component';
import {AddTravelInsuranceComponent} from './modules/insurances/travel-insurances/add-travel-insurance/add-travel-insurance.component';
import {UpdateTravelInsuranceComponent} from './modules/insurances/travel-insurances/update-travel-insurance/update-travel-insurance.component';
import {AddHealthInsuranceComponent} from './modules/insurances/health-insurances/add-health-insurance/add-health-insurance.component';
import {AddThirdPartyInsuranceComponent} from './modules/insurances/third-party-insurances/add-third-party-insurance/add-third-party-insurance.component';
import {AddUserComponent} from './modules/users/add-user/add-user.component';
import {UpdateUserComponent} from './modules/users/update-user/update-user.component';
import {UpdateHealthInsuranceComponent} from './modules/insurances/health-insurances/update-health-insurance/update-health-insurance.component';
import {UpdateThirdPartyInsuranceComponent} from './modules/insurances/third-party-insurances/update-third-party-insurance/update-third-party-insurance.component';
import {authGuard, loginGuard} from "./core/guards/auth.guard";
import {roleGuard} from "./core/guards/role.guard";
import {Role} from "./public/enum/Role";
import {LoginIctComponent} from './modules/auth/login-ict/login-ict.component';
import {UserTabComponent} from "./modules/users/user-tab/user-tab.component";
import {TravelInsurancesTabComponent} from "./modules/insurances/travel-insurances/travel-insurances-tab/travel-insurances-tab.component";
import {ThirdPartyInsurancesTabComponent} from "./modules/insurances/third-party-insurances/third-party-insurances-tab/third-party-insurances-tab.component";
import {HealthInsurancesTabComponent} from "./modules/insurances/health-insurances/health-insurances-tab/health-insurances-tab.component";
import {MychartComponent} from "./modules/Mes Charts/mychart/mychart.component";
import {AddObligatoryInsuranceComponent} from "./modules/insurances/obligatory-insurances/add-obligatory-insurance/add-obligatory-insurance.component";
import {UpdateOfficeComponent} from "./modules/offices/update-office/update-office.component";
import {AddOfficeComponent} from "./modules/offices/add-office/add-office.component";
import {OfficesTabComponent} from "./modules/offices/offices-tab/offices-tab.component";
import {
  ObligatoryInsuranceReportComponent
} from "./modules/reports/obligatory-insurance-report/obligatory-insurance-report.component";
import {
  TravelInsuranceReportComponent
} from "./modules/reports/travel-insurance-report/travel-insurance-report.component";
import {
  HealthInsuranceReportComponent
} from "./modules/reports/health-insurance-report/health-insurance-report.component";
import {
  ThirdPartyInsuranceReportComponent
} from "./modules/reports/third-party-insurance-report/third-party-insurance-report.component";
import {AllInsurancesReportComponent} from "./modules/reports/all-insurances-report/all-insurances-report.component";
import {ChooseReportComponent} from "./modules/reports/choose-report/choose-report.component";
import {PaymentTabComponent} from "./modules/payments/payment-tab/payment-tab.component";
import {PaymentDemandComponent} from "./modules/payments/payment-demand/payment-demand.component";

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  /*{path: '**', redirectTo: 'login', pathMatch: 'full'},*/
  {path: 'dashboard', redirectTo: 'dashboard/home', pathMatch: 'full'},
  {path: 'login', component: LoginAmanaComponent, canActivate: [loginGuard]},
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [authGuard],
    children: [
      {
        path: 'home', canActivate: [roleGuard], data: {role: [Role.Admin, Role.Director, Role.User,Role.Finance]},
        component: MychartComponent
      },
      {
        path: 'offices', canActivate: [roleGuard], data: {role: [Role.Admin]},
        children: [
          {path: '', component: OfficesTabComponent},
          {path: 'update', component: UpdateOfficeComponent},
          {path: 'add', component: AddOfficeComponent},
        ]
      },
      {
        path: 'users', canActivate: [roleGuard], data: {role: [Role.Admin, Role.Director]},
        children: [
          {path: '', component: UserTabComponent},
          {path: 'update', component: UpdateUserComponent},
          {path: 'add', component: AddUserComponent},
        ]
      },
      {
        path: 'obligatoryInsurances', canActivate: [roleGuard], data: {role: [Role.Admin, Role.Director, Role.User]},
        children: [
          {path: '', component: ObligatoryInsurancesTabComponent},
          {path: 'update', component: UpdateObligatoryInsuranceComponent, canActivate: [roleGuard], data: {role: [Role.Director, Role.User]}},
          {path: 'add', component: AddObligatoryInsuranceComponent, canActivate: [roleGuard], data: {role: [Role.Director, Role.User]}},
          /*{path: 'pdfOblig/:id', component: PdfObligComponent},*/
        ]
      },
      {
        path: 'travelInsurances', canActivate: [roleGuard], data: {role: [Role.Admin, Role.Director, Role.User]},
        children: [
          {path: '', component: TravelInsurancesTabComponent},
          {path: 'update', component: UpdateTravelInsuranceComponent, canActivate: [roleGuard], data: {role: [Role.Director, Role.User]}},
          {path: 'add', component: AddTravelInsuranceComponent, canActivate: [roleGuard], data: {role: [Role.Director, Role.User]}}
        ]
      },
      {
        path: 'healthInsurances', canActivate: [roleGuard], data: {role: [Role.Admin, Role.Director, Role.User]},
        children: [
          {path: '', component: HealthInsurancesTabComponent},
          {path: 'add', component: AddHealthInsuranceComponent, canActivate: [roleGuard], data: {role: [Role.Director, Role.User]}},
          {path: 'update', component: UpdateHealthInsuranceComponent, canActivate: [roleGuard], data: {role: [Role.Director, Role.User]}},
        ]
      },
      {
        path: 'thirdPartyInsurances', canActivate: [roleGuard], data: {role: [Role.Admin, Role.Director, Role.User]},
        children: [
          {path: '', component: ThirdPartyInsurancesTabComponent},
          {path: 'add', component: AddThirdPartyInsuranceComponent, canActivate: [roleGuard], data: {role: [Role.Director, Role.User]}},
          {path: 'update', component: UpdateThirdPartyInsuranceComponent, canActivate: [roleGuard], data: {role: [Role.Director, Role.User]}},
        ]
      },
      {
        path: 'reports', canActivate: [roleGuard], data: {role: [Role.Admin, Role.Director, Role.User,Role.Finance]},
        children: [
          {path: "",component: ChooseReportComponent},
          {path: 'obligatory', component: ObligatoryInsuranceReportComponent},
          {path: 'travel', component: TravelInsuranceReportComponent},
          {path: 'health', component: HealthInsuranceReportComponent},
          {path: 'thirdParty', component: ThirdPartyInsuranceReportComponent},
          {path: 'all', component: AllInsurancesReportComponent},
        ]
      },
      {
        path: 'payments', canActivate: [roleGuard], data: {role: [Role.Admin, Role.Director,Role.Finance]},
        children: [
          {path: '', component: PaymentTabComponent},
          {path: 'add', component: PaymentDemandComponent,canActivate: [roleGuard], data: {role: [Role.Director]}},
        ]
      }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
