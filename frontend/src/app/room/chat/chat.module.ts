import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Chat} from "./chat";
import {ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatBadgeModule} from "@angular/material/badge";
import { ChatIdComponent } from './chat-id/chat-id.component';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { AuthInterceptor } from 'src/app/http-interceptors/auth.interceptor';
import { SocketNotificationService } from 'src/app/services/socket-notification.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatChipsModule } from '@angular/material/chips'


@NgModule({
  declarations: [
    ChatIdComponent,
    ChatComponent,
    // RoomComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatInputModule,
    MatTabsModule,
    MatListModule,
    ScrollingModule,
    MatChipsModule,
    // RouterModule,
    
    MatBadgeModule,
    ChatRoutingModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
},
    // SocketNotificationService,
    Chat
],
  exports: [
    // ChatComponent,
    // ChatIdComponent
    
  ]
})
export class ChatModule {
}
