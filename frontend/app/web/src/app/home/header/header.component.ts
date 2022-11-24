import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  public formMessage= new FormGroup({
    message : new FormControl('')
  })

  constructor( private route : ActivatedRoute) {
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
    this.formMessage.controls['message'].reset();
    return true;
  }
}
