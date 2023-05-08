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

@Component({
    selector: 'app-room-creation-form',
    templateUrl: './room-creation-form.component.html',
    styleUrls: ['./room-creation-form.component.scss']
})
export class RoomCreationFormComponent implements OnInit {

    form: FormGroup;
    hidePass = true;

    constructor(
        formBuilder: FormBuilder,
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
    }

    ngOnInit(): void {    
        this.form.reset();
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

    private _errorHandler(err: any): void {
        let errorMsg: string;
    
        if (err.error
                && err.error.message)
            errorMsg = err.error.message;
        else
            errorMsg = "Room creation failed, try again later.";
        this.alertService.openSnackBar(errorMsg, "OK");
    }

    private _postRoom(roomName: string, password?: string): void {
        this.roomCreationFormService.postRoom(
            roomName,
            password
        )
        .subscribe({
            next: (roomData: IRoomData) => {
                this.router.navigate(['/', {
                    outlets: {
                        game: ['room', roomData.id]
                    }
                }]);
            },
            error: (err: any) => {
                console.error(err);
                this._errorHandler(err);
            }
        });
    }

    onSubmit() {
        this._postRoom(
            this.form.get("roomName")?.value,
            this.form.get("password")?.value
        );
    }

}
