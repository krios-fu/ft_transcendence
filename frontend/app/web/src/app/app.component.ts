import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

   i : number = 0;

   public inc() : number {
     return  ++this.i;
   }

   public dec() : number {
     return --this.i;
   }
}

