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
import { AuthService } from 'src/app/services/auth.service';
import { UserDto } from 'src/app/dtos/user.dto';
import { Router } from '@angular/router';
import { AlertServices } from 'src/app/services/alert.service';

@Component({
    selector: 'app-room-creation-form',
    templateUrl: './room-creation-form.component.html',
    styleUrls: ['./room-creation-form.component.scss']
})
export class RoomCreationFormComponent implements OnInit {

    form: FormGroup;
    hidePass = true;

    private _userId: number | undefined;
    private _username: string;

    constructor(
        formBuilder: FormBuilder,
        private readonly authService: AuthService,
        private readonly alertService: AlertServices,
        private readonly roomCreationFormService: RoomCreationFormService,
        private readonly router: Router
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
            "password":[
                "",
                [
                    Validators.minLength(8),
                    Validators.maxLength(15),
                    Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])/)
                ]
            ]
        });
        this._userId = undefined;
        this._username = "";
    }

    ngOnInit(): void {
        let username: string | null;
    
        this.form.reset();
        username = this.authService.getAuthUser();
        if (username)
        {
            this._username = username;
            this._getUserId();
        }
    }

    getNameErrorMessage() {
        const   name: AbstractControl | null = this.form.get("roomName");
    
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
        const   pass: AbstractControl | null = this.form.get("password");
    
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

    private _getUserId(): void {
        this.roomCreationFormService.getUser(this._username)
        .subscribe({
            next: (user: UserDto[]) => {
                this._userId = user[0].id;
            },
            error: (err: any) => {
                console.log("Error getting userId at room creation service.", err);
            }
        });
    }

    private _errorHandler(statusCode: number): void {
        let errorMsg: string;
    
        if (statusCode === 400)
            errorMsg = "Room with provided name already exists.";
        else
            errorMsg = "Room creation failed, try again later.";
        this.alertService.openSnackBar(errorMsg, "OK");
    }

    private _postRoom(roomName: string, ownerId?: number,
                        password?: string): void {
        this.roomCreationFormService.postRoom(
            this._username,
            roomName,
            ownerId,
            password
        )
        .subscribe({
            next: (roomData: IRoomData) => {
                this.router.navigate(['/', {
                    outlets: {
                        game: ['room', roomData.roomName]
                    }
                }]);
            },
            error: (err: any) => {
                console.log(err);
                if (err.status)
                    this._errorHandler(err.status);
                else
                    this._errorHandler(500);
            }
        });
    }

    onSubmit() {
        this._postRoom(
            this.form.get("roomName")?.value,
            this._userId,
            this.form.get("password")?.value
        );
    }

}
