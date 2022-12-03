import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import { UserDto } from 'src/app/dtos/user.dto';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() searchUser = new EventEmitter();
  public formMessage= new FormGroup({
    message : new FormControl('')
  })

  constructor( private route : ActivatedRoute,
    private http: HttpClient ) {
    const room = this.route.snapshot.paramMap.get('id');
    this.formMessage.patchValue({ room } );
  }

  ngOnInit(): void {
    const room = this.route.snapshot.paramMap.get('id');
    this.formMessage.patchValue({ room } );

  }

  search(){
    const { message, room } = this.formMessage.value;
    if( message.trim() == '' )
      return false;
      this.http.get<UserDto[]>(`http://localhost:3000/users/?filter[username]=${message}`)
      .subscribe(
       ( user : UserDto[]) => {
          this.searchUser.emit(user[0])
          console.log('SERACH --->', user);
        }
      )
    this.formMessage.controls['message'].reset();
    return true;
  }
}
