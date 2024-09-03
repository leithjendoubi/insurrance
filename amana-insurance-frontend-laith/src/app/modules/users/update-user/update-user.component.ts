import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../core/services/user.service";
import {User} from "../../../public/models/user.model";
import {Role} from "../../../public/enum/Role";
import {StorageService} from "../../../core/services/storage.service";
import {DataService} from "../../../core/services/data.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Card} from "../../../public/shared/card";
import {MyForm} from "../../../public/shared/my-form";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {confirmPasswordValidator} from "../../../core/validators/confirm-password.validator";
import {DialogComponent} from "../../../public/components/dialog/dialog.component";

@Component({
    selector: 'app-update-user',
    templateUrl: './update-user.component.html',
    styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
    constructor(private userService: UserService, private dialog: MatDialog, private router: Router, private tokenStorageService: StorageService, private data: DataService) {
    }
    actualUser = this.tokenStorageService.getUser()
    user: User = history.state?.data;
    cards: Card[] = [
        {
            title: "معلومات عن المستخدم",
            fields: [
                {
                    hasAction: 'no',
                    form: {
                        type: "select",
                        label: "إسم المكتب",
                        hidden: this.actualUser.role != Role.Admin,
                        formControlName: "bureau",
                        selectOptions: this.data.offices,
                        isObject: true
                    }

                },
                {
                    hasAction: 'no',
                    form: {
                        type: "text",
                        label: "إسم المستخدم",
                        hidden: false,
                        formControlName: "name",
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
                        selectOptions: [Role.Finance,Role.Director],
                        isObject: false
                    }

                }
            ]
        },
    ]

    myForm: MyForm = {
        title: "تعديل مستخدم",
        formGroup: new FormGroup({
            name: new FormControl(this.user.username, Validators.required),
            address: new FormControl(this.user.address, Validators.required),
            phone: new FormControl(this.user.phone, [Validators.required, Validators.pattern('[0-9]{10}$')]),
            role: this.actualUser.role === Role.Admin ? new FormControl({
                value: this.user.role,
                disabled: true
            }, Validators.required) : new FormControl(''),
            bureau: this.actualUser.role === Role.Admin ? new FormControl({
                value: this.user.bureauId,
                disabled: true
            }, Validators.required) : new FormControl({value: '', disabled: true}),
        }),
        cards: this.cards
    }

    ngOnInit() {
        if (this.actualUser.role === Role.Admin) {
            this.data.fetchOffices()
        }
    }

    onSubmit() {
        if (!this.myForm.formGroup.pristine && this.myForm.formGroup.valid) {
            const dialogRef = this.dialog.open(DialogComponent, {
                data: {
                    title: "المستخدمين",
                    content: "هل تريد تعديل هذا المستخدم ؟",
                    isLoading: false,
                    onSubmit: () => this.updateUser(dialogRef)
                }, autoFocus: false, panelClass: 'choice-dialog-container'
            });

        }
    }

    updateUser(dialogRef: MatDialogRef<DialogComponent>) {
        dialogRef._containerInstance._config.data.isLoading = true
        const form = this.myForm.formGroup
        this.user.username = form.get("name")?.value
        this.user.address = form.get("address")?.value
        this.user.phone = form.get("phone")?.value
        this.userService.UpdateUser(this.user).subscribe({
            next: (Response) => {
                dialogRef._containerInstance._config.data.isLoading = true
                dialogRef.close()
                this.router.navigate(['/dashboard/users'])
            }, error: (err) => {
                dialogRef._containerInstance._config.data.isLoading = true
                dialogRef.close()
                this.myForm.formGroup.reset()
                console.log("eroor is ", err)
            }
        })
    }

    protected readonly Role = Role;
}
