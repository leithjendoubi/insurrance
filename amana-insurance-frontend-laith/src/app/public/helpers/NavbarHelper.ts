import {NavbarData} from "../shared/navbar-data";

export const NavbarHelper = {
  initializeNavbarData( isAdmin: boolean, isDirector: boolean, isFinance: boolean,isUser:boolean):NavbarData[]{
    let AllNavbarData:NavbarData[] = [
      {
        routerLink: '/dashboard/home',
        Label: "الرئيسية",
        Icon: 'dashboard',
        canAccess: true
      },
      {
        routerLink: '/dashboard/offices',
        Label: "المكاتب",
        Icon: 'maps_home_work',
        canAccess: isAdmin
      },
      {
        routerLink: '/dashboard/users',
        Label: "المستخدمين",
        Icon: 'manage_accounts',
        canAccess: isAdmin || isDirector
      },
      {
        routerLink: '/dashboard/obligatoryInsurances',
        Label: "تأمين إجباري",
        Icon: 'priority_high',
        canAccess: !isFinance
      },
      {
        routerLink: '/dashboard/travelInsurances',
        Label: "تأمين المسافرين",
        Icon: 'flight',
        canAccess: !isFinance
      },
      {
        routerLink: '/dashboard/healthInsurances',
        Label: "تأمين صحي",
        Icon: 'medical_information',
        canAccess: !isFinance
      },
      {
        routerLink: '/dashboard/thirdPartyInsurances',
        Label: "تأمين طرف ثالث",
        Icon: 'emoji_transportation',
        canAccess: !isFinance
      },
      {
        routerLink: '/dashboard/payments',
        Label: "الإستخلاص",
        Icon: 'payments',
        canAccess: !isUser
      },
      {
        routerLink: '/dashboard/reports',
        Label: "التقارير",
        Icon: 'receipt_long',
        canAccess:true
      }
    ]
    return AllNavbarData.filter((navbarData:NavbarData) => navbarData.canAccess)
  }
}
