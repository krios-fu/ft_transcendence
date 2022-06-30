import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ChatComponent} from "../chat/chat.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private code = '';
  constructor( private route : ActivatedRoute, private http : HttpClient ) { }

  ngOnInit(): void {


    this.route.queryParams
      .subscribe(params => {
        this.code+= '?code='+params['code'];
        console.log(this.code);
      })

    this.http.get('http://localhost:3000/auth/42/redirect'+this.code)
      .subscribe( dta => console.log(dta) );

  }

}
