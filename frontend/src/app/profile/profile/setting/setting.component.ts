import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AlertServices } from 'src/app/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  @Output() messageEvent = new EventEmitter<boolean>();

  isChecked = true;
  namePhoto = '';
  urlPreview = ''
  formGroup = this._formBuilder.group({
    doubleAuth: false,
    defaultOffline: false,
    nickName: ''
  });

  user = {} as UserDto;
  file = undefined;
  icon = 'lock'
  public qr_generate = ''
  constructor(private http: HttpClient,
    private usersService: UsersService,
    private authService: AuthService,
    private _formBuilder: FormBuilder,
    public alertServices: AlertServices,
    public dialogo: MatDialog
    ) {
    this.usersService.getUser('me')
      .subscribe({
        next: (user) => {
          this.user = user;

          this.formGroup.get("doubleAuth")?.setValue(this.user.doubleAuth, { emitEvent: true });
          this.formGroup.get("defaultOffline")?.setValue(this.user.defaultOffline, { emitEvent: true });
          this.formGroup.get("nickName")?.setValue(this.user.nickName, { emitEvent: true });
          this.urlPreview = this.user?.photoUrl;
        }
      })
    this.messageEvent.emit(true);
  }

  ngOnInit(): void {
  }


  onFile(event: any) {
    this.file = event.target.files[0];
    this.namePhoto = event.target.files[0].name;

    const reader = new FileReader();
    reader.onload = () => {
      this.urlPreview = reader.result as string;
    }

    reader.readAsDataURL(this.file as any);
    this.changeDetected();

  }

  auth2fa() {
    if(this.user.doubleAuth)
    this.http.post(`${environment.apiUrl}auth/2fa/deactivate`, this.user.username,)
    .subscribe((dta: any) => {
      // this.qr_generate = dta.qr.qr;
    })

    if (!this.user.doubleAuth && !this.qr_generate)
    this.http.post(`${environment.apiUrl}auth/2fa/generate`, this.user.username,)
      .subscribe((dta: any) => {
        this.qr_generate = dta.qr.qr;
      })
  }

  confir(code: any): Observable<HttpResponse<any>> {

    return this.http.post<any>(`${environment.apiUrl}auth/2fa/confirm`, { token: code }).pipe(
      tap((res: any) => {

        this.user.doubleAuth = true;
        this.qr_generate = '';
      }),
      catchError((err: HttpErrorResponse) => {

        alert("Code otp Error");
        return throwError(() => err);
      })
    )
  }

  confimateOtp(code: any) {
    if(code.length > 0)
    this.confir(code).subscribe(lol => {
    })
  }

  changeDetected() {
    this.icon = 'lock_open';
  }

  alertFormValues(formGroup: FormGroup, login: any) {
    const nickname = login.trim();

    if (nickname.length < 3 || nickname.length > 8) {
      alert('Error login');
      return;

    }
    const form = formGroup.getRawValue();

    if (this.icon === 'lock_open' && (login) )
      this.http.patch(`${environment.apiUrl}users/me/settings`, { ...form, nickName: nickname })
        .subscribe(
          data => {
            this.icon = 'lock';
          });
    if (this.file) {
      const formData = new FormData();

      formData.append("avatar", this.file);

      this.http.post(`${environment.apiUrl}users/me/avatar`, formData)
        .subscribe(
          data => {
            this.icon = 'lock';
          });
    }

    this.alertServices.openSnackBar("Changes saved", "Close");
  }

  getPhoto(): string { return this.urlPreview; }

  logout() { this.authService.logout(); }

}
