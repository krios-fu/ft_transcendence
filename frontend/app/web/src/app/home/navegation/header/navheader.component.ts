import {Component, Input, OnInit} from '@angular/core';
import {Payload} from "../../../dtos/user.dto";

@Component({
  selector: 'app-navheader',
  templateUrl: './navheader.component.html',
  styleUrls: ['./navheader.component.scss']
})
export class NavHeaderComponent implements OnInit {

  constructor() { }

  @Input() profile = {};
  hidden = false;

  ngOnInit(): void {
  }

  getName()  {
    try {
      const pp = this.profile as Payload;
      return pp.userProfile.username;
    }
    catch {}
    return "marvin";
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

}
