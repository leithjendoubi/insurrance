import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginAmanaComponent } from './modules/auth/login-amana/login-amana.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObligatoryInsurancesTabComponent } from './modules/insurances/obligatory-insurances/obligatory-insurances-tab/obligatory-insurances-tab.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component'; // Import FormsModule or ReactiveFormsModule
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { UpdateObligatoryInsuranceComponent } from './modules/insurances/obligatory-insurances/update-obligatory-insurance/update-obligatory-insurance.component';
import { MychartComponent } from './modules/Mes Charts/mychart/mychart.component';
import { NgChartsModule } from 'ng2-charts';
import { AddTravelInsuranceComponent } from './modules/insurances/travel-insurances/add-travel-insurance/add-travel-insurance.component';
import { TravelInsurancesTabComponent } from './modules/insurances/travel-insurances/travel-insurances-tab/travel-insurances-tab.component';
import { LineChartComponent } from './modules/Mes Charts/line-chart/line-chart.component';
import { UpdateTravelInsuranceComponent } from './modules/insurances/travel-insurances/update-travel-insurance/update-travel-insurance.component';
import { AddHealthInsuranceComponent } from './modules/insurances/health-insurances/add-health-insurance/add-health-insurance.component';
import { ObligatoryInsuranceReportComponent } from './modules/reports/obligatory-insurance-report/obligatory-insurance-report.component';
import { ThirdPartyInsurancesTabComponent } from './modules/insurances/third-party-insurances/third-party-insurances-tab/third-party-insurances-tab.component';
import { HealthInsurancesTabComponent } from './modules/insurances/health-insurances/health-insurances-tab/health-insurances-tab.component';
import { AddThirdPartyInsuranceComponent } from './modules/insurances/third-party-insurances/add-third-party-insurance/add-third-party-insurance.component';
import { AddUserComponent } from './modules/users/add-user/add-user.component';
import { UserTabComponent } from './modules/users/user-tab/user-tab.component';
import { UpdateUserComponent } from './modules/users/update-user/update-user.component';
import { UpdateHealthInsuranceComponent } from './modules/insurances/health-insurances/update-health-insurance/update-health-insurance.component';
import { AddOfficeComponent } from './modules/offices/add-office/add-office.component';
import { UpdateThirdPartyInsuranceComponent } from './modules/insurances/third-party-insurances/update-third-party-insurance/update-third-party-insurance.component';
import { ThirdPartyInsuranceReportComponent } from './modules/reports/third-party-insurance-report/third-party-insurance-report.component';
import { HealthInsuranceReportComponent } from './modules/reports/health-insurance-report/health-insurance-report.component';
import { TravelInsuranceReportComponent } from './modules/reports/travel-insurance-report/travel-insurance-report.component';
import { AllInsurancesReportComponent } from './modules/reports/all-insurances-report/all-insurances-report.component';
import { PaymentTabComponent } from './modules/payments/payment-tab/payment-tab.component';
import {TokenInterceptor} from "./core/interceptors/token.interceptor";
import { AddPersonHealthInsuranceComponent } from './modules/insurances/health-insurances/add-health-insurance/add-person-health-insurance/add-person-health-insurance.component';
import { AddGroupHealthInsuranceComponent } from './modules/insurances/health-insurances/add-health-insurance/add-group-health-insurance/add-group-health-insurance.component';
import {LoginIctComponent} from './modules/auth/login-ict/login-ict.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import { MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCustomButtonComponent} from "./public/components";
import {MatGridListModule} from "@angular/material/grid-list";
import {ShowOnDirtyErrorStateMatcher} from "@angular/material/core";
import {
  UpdateGroupHealthInsuranceComponent
} from "./modules/insurances/health-insurances/update-health-insurance/update-group-health-insurance/update-group-health-insurance.component";
import {
  UpdatePersonHealthInsuranceComponent
} from "./modules/insurances/health-insurances/update-health-insurance/update-person-health-insurance/update-person-health-insurance.component";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {SideNavbarComponent} from "./public/components/side-navbar/side-navbar.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDividerModule} from "@angular/material/divider";
import {BodyComponentComponent} from "./modules/body-component/body-component.component";
import {TableComponent} from "./public/components/table/table.component";
import {FormComponent} from "./public/components/form/form.component";
import {MatCardModule} from "@angular/material/card";
import {DialogComponent} from "./public/components/dialog/dialog.component";
import {MyErrorStateMatcher} from "./core/validators/my-error-state-matcher";
import {LoginComponent} from "./public/components/login/login.component";
import {AddObligatoryInsuranceComponent} from "./modules/insurances/obligatory-insurances/add-obligatory-insurance/add-obligatory-insurance.component";
import {OfficesTabComponent} from "./modules/offices/offices-tab/offices-tab.component";
import {UpdateOfficeComponent} from "./modules/offices/update-office/update-office.component";
import {CookieService} from "ngx-cookie-service";
import {NgToastModule} from "ng-angular-popup";
import {PaymentDemandComponent} from "./modules/payments/payment-demand/payment-demand.component";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {RouterLink} from "@angular/router";
import {MAT_DATE_LOCALE} from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    LoginAmanaComponent,
    AddObligatoryInsuranceComponent,
    ObligatoryInsurancesTabComponent,
    ObligatoryInsuranceReportComponent,
    DashboardComponent,
    UpdateObligatoryInsuranceComponent,
    MychartComponent,
    AddTravelInsuranceComponent,
    TravelInsurancesTabComponent,
    LineChartComponent,
    UpdateTravelInsuranceComponent,
    AddHealthInsuranceComponent,
    ObligatoryInsuranceReportComponent,
    ThirdPartyInsurancesTabComponent,
    HealthInsurancesTabComponent,
    AddThirdPartyInsuranceComponent,
    AddUserComponent,
    UserTabComponent,
    UpdateUserComponent,
    UpdateHealthInsuranceComponent,
    OfficesTabComponent,
    AddOfficeComponent,
    UpdateOfficeComponent,
    UpdateThirdPartyInsuranceComponent,
    ThirdPartyInsuranceReportComponent,
    HealthInsuranceReportComponent,
    TravelInsuranceReportComponent,
    AllInsurancesReportComponent,
    PaymentDemandComponent,
    PaymentTabComponent,
    AddPersonHealthInsuranceComponent,
    AddGroupHealthInsuranceComponent,
    LoginIctComponent,
    UpdateGroupHealthInsuranceComponent,
    UpdatePersonHealthInsuranceComponent,
    BodyComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCustomButtonComponent,
    MatGridListModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDividerModule,
    MatCardModule,
    SideNavbarComponent,
    TableComponent,
    FormComponent,
    DialogComponent,
    LoginComponent,
    NgToastModule,
    MatBottomSheetModule
  ],
  providers: [
    TableComponent,
    RouterLink,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptor,
      multi:true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'ar-ly' },
    {
      provide:MyErrorStateMatcher,
      useClass:ShowOnDirtyErrorStateMatcher
    },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
