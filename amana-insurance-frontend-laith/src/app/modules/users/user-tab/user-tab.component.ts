import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Router} from '@angular/router';
import {User} from "../../../public/models/user.model";
import {UserService} from "../../../core/services/user.service";
import {OfficeService} from "../../../core/services/office.service";
import {StorageService} from "../../../core/services/storage.service";
import {Role} from "../../../public/enum/Role";
import {Column} from "../../../public/shared/column";
import {DialogComponent} from "../../../public/components/dialog/dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Office} from "../../../public/models/office.model";
import {DataService} from 'src/app/core/services/data.service';
import {TablesHelper} from "../../../public/helpers/TablesHelper";

@Component({
  selector: 'app-user-tab',
  templateUrl: './user-tab.component.html',
  styleUrls: ['./user-tab.component.scss']
})
export class UserTabComponent implements OnInit {
  constructor(private userService: UserService, private storageService: StorageService, private router: Router, private dialog: MatDialog) {
  }

  tableColumns: Array<Column> = [
    {columnDef: 'id', header: 'No.', cell: (element: Record<string, number>) => `${this.users.findIndex((user) => user.id === element['id']) + 1}`},
    {columnDef: 'username', header: 'إسم المستخدم', cell: (element: Record<string, string>) => `${element['username']}`},
    {columnDef: 'phone', header: 'رقم الهاتف', cell: (element: Record<string, number>) => `${element['phone']}`},
    {columnDef: 'bureau', header: 'إسم المكتب', cell: (element: Record<string, Office>) => `${element['bureau'] != null ? element['bureau'].name : 'إدارة مكاتب'}`},
    {columnDef: 'role', header: 'الوظيفة', cell: (element: Record<string, Role>) => `${element['role']}`},
    {columnDef: 'settings', header: '', cell: (element: Record<string, any>) => `${element['settings']}`}
  ];
  addButton = {
    label: 'إضافة مستخدم',
    icon: 'group_add',
    disabled: false
  }

  users: Array<User> = [];
  actualUser = this.storageService.getUser();
  readonly Role = Role;

  fetchUsers() {
    this.actualUser?.role === Role.Admin ?
      this.userService.getUsers().subscribe({
          next: (Response) => {
            this.users = Response.filter(user => user.id != this.storageService.getUser().id);
          }, error: err => {
            console.log("error is ", err)
          }
        }
      ) :
      this.userService.getUsersByOffice(this.storageService.getUser()?.bureauId).subscribe({
          next: (Response) => {
            this.users = Response.filter(user => user.id != this.storageService.getUser().id);
          }, error: err => {
            console.log("error is ", err)
          }
        }
      )
  }

  ngOnInit(): void {
    this.fetchUsers()
  }

  search(searchKey: string) {
    if (searchKey != "") {
      if (this.actualUser.role === Role.Admin) {
        this.userService.SearchUsers(searchKey).subscribe({
            next: (Response) => {
              this.users = Response.filter(user => user.id != this.storageService.getUser().id);
            }, error: err => {
              console.log("error is ", err)
            }
          }
        );
      } else {
        const bureau = {
          bureauId: this.actualUser.bureauId
        }
        this.userService.SearchUsersByOffice(searchKey, bureau).subscribe({
            next: (Response) => {
              this.users = Response.filter(user => user.id != this.storageService.getUser().id);
            }, error: err => {
              console.log("error is ", err)
            }
          }
        )
        ;
      }
    } else {
      this.fetchUsers()
    }
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: "المستخدمين",
        content: "هل تريد حذف هذا المستخدم ؟",
        isLoading: false,
        onSubmit: () => this.deleteRow(id, dialogRef)
      }, autoFocus: false, panelClass: 'choice-dialog-container'
    });

  }

  deleteRow(id: number, dialogRef: MatDialogRef<DialogComponent>) {
    dialogRef.componentInstance.data.isLoading = true
    this.userService.DeletUser(id).subscribe({
        next: (Response) => {
          dialogRef.componentInstance.data.isLoading = false
          dialogRef.close()
          this.fetchUsers()
        }, error: err => {
          dialogRef.componentInstance.data.isLoading = false
          dialogRef.close()
          console.log("error is ", err)
        }
      }
    )
  }
}
