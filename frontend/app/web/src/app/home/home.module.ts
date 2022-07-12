import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {ChatModule} from "../chat/chat.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";



@NgModule({
  declarations: [
    HomeComponent
  ],
    imports: [
        CommonModule,
        ChatModule,
        ReactiveFormsModule,
        MatExpansionModule


    ]
})
export class HomeModule { }
