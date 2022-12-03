import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { UserDto } from 'src/app/dtos/user.dto';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit{

  @Output() messageEvent = new EventEmitter<boolean>();


  isChecked = true;
  formGroup = this._formBuilder.group({
    enableWifi: '',
    acceptTerms: ['', Validators.requiredTrue],
  });
  
  user : any;
  constructor(private http : HttpClient,
    private usersService: UsersService,
    private authService: AuthService, 
    private _formBuilder: FormBuilder) { 
      const username = this.authService.getAuthUser() as string;
    this.user = null;
    this.usersService.getUser()
      .subscribe({
        next: (user ) => {
          this.user = user;
        }
      })
      this.messageEvent.emit(false);
    }

  ngOnInit(): void {
  }


  alertFormValues(formGroup: FormGroup) {
    alert(JSON.stringify(formGroup.value, null, 2));
  }
  getPhoto() : string {
 
    if(this.user)
      return this.user.photoUrl;
    return "https://ih1.redbubble.net/image.1849186021.6993/flat,750x,075,f-pad,750x1000,f8f8f8.jpg";

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
