import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";



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
    console.log( message, room)
    if( message.trim() == '' )
      return false;
      this.http.get(`http://localhost:3000/users/${message}`)
      .subscribe(
        user => {
          this.searchUser.emit(user)
          console.log(user);
        }
      )
    this.formMessage.controls['message'].reset();
    return true;
  }
}
