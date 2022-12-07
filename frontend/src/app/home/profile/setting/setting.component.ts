import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  @Output() messageEvent = new EventEmitter<boolean>();


  isChecked = true;
  formGroup = this._formBuilder.group({
    doubleAuth: false,
    acceptedTerms: [false, Validators.requiredTrue],
    defaultOffline: false,
    nickName: ''
  });

  user = {} as UserDto;
  icon = 'lock'
  constructor(private http: HttpClient,
    private usersService: UsersService,
    private authService: AuthService,
    private _formBuilder: FormBuilder) {
    this.usersService.getUser('me')
      .subscribe({
        next: (user) => {
          this.user = user[0];

          console.log('---> settind', this.user);

          this.formGroup.get("doubleAuth")?.setValue(this.user.doubleAuth, { emitEvent: true });
          this.formGroup.get("acceptedTerms")?.setValue(this.user.acceptedTerms, { emitEvent: true });
          this.formGroup.get("defaultOffline")?.setValue(this.user.defaultOffline, { emitEvent: true });
          this.formGroup.get("nickName")?.setValue(this.user.nickName, { emitEvent: true });


        }
      })
    this.messageEvent.emit(true);
  }

  ngOnInit(): void {
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

    console.log('Setting form---->', { ...form, nickName: nickname });

    if (this.icon === 'lock_open')
      this.http.patch('http://localhost:3000/users/me/settings', { ...form, nickName: nickname })
        .subscribe(
          data => {
            console.log(data);
            this.icon = 'lock';
          });
  }

  getPhoto(): string {
      return this.user?.photoUrl;
  }


  logout() { this.authService.logout(); }


  // getPhoto() {
  //   try {
  //     const pp = this.profile as UserDto;
  //     return pp.photoUrl;
  //   }
  //   catch {}
  //   return "https://ih1.redbubble.net/image.1849186021.6993/flat,750x,075,f-pad,750x1000,f8f8f8.jpg";
  // }
}
