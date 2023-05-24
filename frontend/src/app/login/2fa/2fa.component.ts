import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, tap, throwError  } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import {IAuthPayload} from "../../interfaces/iauth-payload.interface";

@Component({
  selector: 'app-2fa',
  templateUrl: './2fa.component.html',
  styleUrls: ['./2fa.component.scss']
})
export class TwofaComponent implements OnInit {
  maxCodeLength = 6;
  showButton = false;

  constructor(private authService: AuthService) { }

    validate(code: string): void{
        console.log('ping');
        this.authService.confirm2FA(code);
    }

    showSubmitButton(code: string) {
        if (code.length === this.maxCodeLength) {
            this.showButton = true;
        } else {
            this.showButton = false;
        }
    }

    ngOnInit(): void { }
}
