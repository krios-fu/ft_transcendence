import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { Chat } from "./chat";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
 
})
export class ChatComponent {


  constructor() { }

}
