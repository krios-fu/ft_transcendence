import {
    Component,
    OnInit
} from '@angular/core';
import {
    FormGroup,
    Validators,
    FormBuilder,
    AbstractControl
} from '@angular/forms';
import {
    IRoomData,
    RoomCreationFormService
} from './room-creation-form.service';
import { Router } from '@angular/router';
import { AlertServices } from 'src/app/services/alert.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Roles } from 'src/app/roles';
import { UserDto } from 'src/app/dtos/user.dto';
import { UsersService } from 'src/app/services/users.service';


@Component({
    selector: 'app-room-creation-form',
    templateUrl: './room-creation-form.component.html',
    styleUrls: ['./room-creation-form.component.scss']
})
export class RoomCreationFormComponent implements OnInit {

    form: FormGroup;
    hidePass = true;
    official = false;
    me?: UserDto;

    constructor(
        formBuilder: FormBuilder,
        private readonly alertService: AlertServices,
        private readonly roomCreationFormService: RoomCreationFormService,
        private readonly router: Router,
        private http: HttpClient,
        private usersService: UsersService,

    ) {
        this.form = formBuilder.group({
            "roomName": [
                "",
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(15),
                    Validators.pattern(/^\w+$/)
                ]
            ],
            "password": [
                "",
                [
                    Validators.minLength(8),
                    Validators.maxLength(15),
                    Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])/)
                ]
            ],
            "official" : Boolean
        });
    }

    ngOnInit(): void {
        this.usersService.getUser('me')
        .subscribe( (user : UserDto) => {
            this.me = user;
            this.usersService.get_role(this.me);
            this.form.reset();
        })
    }

    getNameErrorMessage() {
        const name: AbstractControl | null = this.form.get("roomName");

        if (!name)
            return ('');
        if (name.hasError('required'))
            return ('You must enter a value');
        else if (name.hasError('maxlength'))
            return ('Max. 15 characters');
        return (
            name.hasError('pattern')
                ? 'Only letters, numbers and _ allowed' : ''
        );
    }

    getPasswordErrorMessage() {
        const pass: AbstractControl | null = this.form.get("password");

        if (!pass)
            return ('');
        if (pass.hasError('required'))
            return ('You must enter a value');
        else if (pass.hasError('minlength'))
            return ('Min. 8 characters');
        else if (pass.hasError('maxlength'))
            return ('Max. 15 characters');
        return (
            pass.hasError('pattern')
                ? 'Include upper/lower case, number and symbol' : ''
        );
    }

    private _errorHandler(err: any): void {
        let errorMsg: string;

        if (err.error
            && err.error.message)
            errorMsg = err.error.message;
        else
            errorMsg = "Room creation failed, try again later.";
        this.alertService.openSnackBar(errorMsg, "OK");
    }

    private _postRoom(roomName: string, password?: string, role?: number): void {
        this.roomCreationFormService.postRoom(
            roomName,
            password
        )
            .subscribe({
                next: (roomData: IRoomData) => {
                    console.log("roomData", roomData);
                    if (role) {
                    console.log("roomData", role);

                        this.http.post(`${environment.apiUrl}room_roles`, { roomId: roomData.id, roleId: role })
                            .subscribe((data: any) => {
                                
                                this.router.navigate(['/game', roomData.id]);
                            });
                    }
                    else
                        this.router.navigate(['/game', roomData.id]);
                },
                error: (err: any) => {
                    console.error(err);
                    this._errorHandler(err);
                }
            });
    }

    onSubmit() {
        console.log("STATUS", this.form.get("official")?.value );
        if (this.form.get("official")?.value)
            this._postRoom(
                this.form.get("roomName")?.value,
                this.form.get("password")?.value,
                Roles.official
            );
        else
            this._postRoom(
                this.form.get("roomName")?.value,
                this.form.get("password")?.value,
                
            );
    }

}
