import {Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {StorageService} from "../../../core/services/storage.service";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {SideNavToggle} from "../../shared/side-nav-toggle";
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {AuthService} from "../../../core/services/auth.service";
import {Role} from '../../enum/Role';
import {NavbarData} from "../../shared/navbar-data";
import {DataService} from "../../../core/services/data.service";
import {NavbarHelper} from "../../helpers/NavbarHelper";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialog/dialog.component";

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, RouterLink, MatIconModule, MatDividerModule, RouterLinkActive],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss'
})

export class SideNavbarComponent implements OnInit{
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false
  screenWidth = 0
  actualRole = this.storageService.getUser()?.role
  navbar: NavbarData[] = []
  readonly Role = Role

  constructor(private authService: AuthService, private storageService: StorageService, private router: Router, protected dataService: DataService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.dataService.isAdmin = this.actualRole === Role.Admin
    this.dataService.isDirector = this.actualRole === Role.Director
    this.dataService.isUser = this.actualRole === Role.User
    this.dataService.isFinance = this.actualRole === Role.Finance
    this.navbar = NavbarHelper.initializeNavbarData(this.dataService.isAdmin, this.dataService.isDirector, this.dataService.isFinance, this.dataService.isUser)
    this.screenWidth = window.innerWidth
  }


  onLogout() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "الخروج",
        content: "هل تريد الخروج ؟",
        isLoading: false,
        onSubmit: () => this.logout(dialogRef)
      }, autoFocus: false, panelClass: 'choice-dialog-container'
    });
  }


  logout(dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef.componentInstance.data.isLoading = true
    this.authService.logout().subscribe({
      next: (res) => {
        dialogRef.componentInstance.data.isLoading = false
        dialogRef.close()
        this.storageService.deleteUser()
        this.router.navigate(['/login']);
      }, complete : () => {
        dialogRef.componentInstance.data.isLoading = false
        dialogRef.close()
        this.storageService.deleteUser()
        this.router.navigate(['/login']);
        //console.log("error is ", err)
      }
    })



  }

  toggleCollapse() {
    this.collapsed = !this.collapsed
    this.onToggleSideNav.emit({screenWidth: this.screenWidth, collapsed: this.collapsed})
  }

  sideNavClosed() {
    this.collapsed = false
    this.onToggleSideNav.emit({screenWidth: this.screenWidth, collapsed: this.collapsed})
  }
}
