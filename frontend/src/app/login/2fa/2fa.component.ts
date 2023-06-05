import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, tap, throwError  } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

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
        this.authService.confirm2FA(code);
    }

    showSubmitButton(code: string) {
        if (code.length === this.maxCodeLength) {
            this.showButton = true;
        } else {
            this.showButton = false;
        }
    }

    ngOnInit(): void {
        // if (this.authService.isAuthenticated())
        // this.authService.redirectHome();
    }
}
