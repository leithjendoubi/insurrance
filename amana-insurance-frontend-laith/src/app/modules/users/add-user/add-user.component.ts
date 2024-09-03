import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DataService} from "../../../core/services/data.service";
import {User} from "../../../public/models/user.model";
import {StorageService} from "../../../core/services/storage.service";
import {Role} from "../../../public/enum/Role";
import {UserService} from "../../../core/services/user.service";
import {Router} from "@angular/router";
import {Card} from "../../../public/shared/card";
import {MyForm} from "../../../public/shared/my-form";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DialogComponent} from "../../../public/components/dialog/dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {confirmPasswordValidator} from "../../../core/validators/confirm-password.validator";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  constructor(private userService: UserService, private dialog: MatDialog, private router: Router, private tokenStorageService: StorageService, private data: DataService) {
  }

  actualUser = this.tokenStorageService.getUser()
  showPassword = false;
  showConfirmPassword = false;

  cards: Card[] = [
    {
      title: "معلومات عن المستخدم",
      fields: [
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "إسم المستخدم",
            hidden: false,
            formControlName: "name",
            errorsMessages: {
              alreadyExist: 'إسم المستخدم موجود بالفعل'
            }
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "text",
            label: "عنوان المستخدم",
            hidden: false,
            formControlName: "address",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "tel",
            label: "رقم هاتف المستخدم",
            hidden: false,
            errorsMessages: {
              pattern: 'يجب أن يتكون رقم هاتف المستخدم من 10 أرقام',
            },
            formControlName: "phone",
          }
        },
        {
          hasAction: 'no',
          form: {
            type: "select",
            label: "الوظيفة",
            hidden: this.actualUser.role != Role.Admin,
            formControlName: "role",
            selectOptions: [Role.Finance],
            isObject: false
          }
        }
      ]
    },
    {
      title: "معلومات عن حماية المستخدم",
      fields: [
        {
          hasAction: 'no',
          form: {
            type: this.showPassword ? "text" : "password",
            label: 'كلمة مرور المستخدم',
            hidden: false,
            formControlName: "password",
            suffix_icon: this.showPassword ? "visibility" : "visibility_off",
            showPassword: () => {
              this.showPassword = !this.showPassword
            }
          }
        },
        {
          hasAction: 'no',
          form: {
            type: this.showConfirmPassword ? "text" : "password",
            label: 'تأكيد كلمة مرور المستخدم',
            hidden: false,
            formControlName: "confirmPassword",
            suffix_icon: this.showConfirmPassword ? "visibility" : "visibility_off",
            showPassword: () => {
              this.showConfirmPassword = !this.showConfirmPassword
            },
            errorsMessages: {
              matching: 'كلمة المرور غير متطابقة'
            }
          }
        },
      ]
    }
  ]

  myForm: MyForm = {
    title: "إضافة مستخدم جديد",
    formGroup: new FormGroup({
      name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', [Validators.required, confirmPasswordValidator('password')]),
      address: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}$')]),
      role: this.actualUser.role === Role.Admin ? new FormControl('', Validators.required) : new FormControl(''),
      //bureau: this.actualUser.role === Role.Admin ? new FormControl('', Validators.required) : new FormControl(''),
    }),
    cards: this.cards
  }

  ngOnInit() {
    if (this.actualUser.role === Role.Admin) {
      this.data.fetchOffices()
      if (this.cards[0].fields[0].form.type === 'select')
        this.cards[0].fields[0].form.selectOptions = this.data.offices
    }
  }


  onSubmit() {
    if (!this.myForm.formGroup.pristine && this.myForm.formGroup.valid) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: "المستخدمين",
          content: "هل تريد إضافة هذا المستخدم ؟",
          isLoading: false,
          onSubmit: () => this.addUser(dialogRef)
        }, autoFocus: false, panelClass: 'choice-dialog-container'
      });
    }
  }

  addUser(dialogRef:MatDialogRef<DialogComponent>) {
    dialogRef.componentInstance.data.isLoading = true
    const form = this.myForm.formGroup
    const user = new User()
    user.username = form.get("name")?.value
    user.password = form.get("password")?.value
    user.address = form.get("address")?.value
    user.phone = form.get("phone")?.value
    user.bureauId = this.actualUser.bureauId
    user.role = this.actualUser.role === Role.Admin ? form.get("role")?.value : Role.User
    user.hypervisorId = this.actualUser.id
    this.userService.createUser(user).subscribe({
      next:data => {
      dialogRef.componentInstance.data.isLoading = false
      dialogRef.close()
      this.router.navigate(['/dashboard/users'])
    },error:err => {
        dialogRef.componentInstance.data.isLoading = false
        dialogRef.close()
        if(err.status===422){
          this.myForm.formGroup.get("name")?.setErrors({alreadyExist:true})
        }
        //console.log(err)
      }
    })
  }

  /*user=new User()
  protected readonly Role = Role;
  actualUser=this.tokenStorageService.getUser()

  constructor (protected data : DataService,private tokenStorageService:TokenStorageService,private router:Router,private userService:UserService) {}

  ngOnInit() {
    if(this.actualUser.role==Role.Admin){
      this.data.fetchBureaux()
    }
  }
  add(){
    this.userService.createUser(this.user).subscribe((Response)=>{
      this.router.navigate(['/dashboard'])
    })
  }*/


}
