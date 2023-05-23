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

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  confirm(code: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.apiUrl + '/auth/2fa/validate', { token: code })
      .pipe(
        tap( (res: HttpResponse<IAuthPayload>) => {
            if (!res.body) {
                return throwError(() => new HttpErrorResponse({status: 400}));
            }
            this.authService.setAuthInfo({
                'accessToken': res.body.accessToken,
                'username': res.body.username,
                'id': res.body.id
            });
            this.authService.redirectHome();
            return res;
        }),
        catchError((err: HttpErrorResponse) => {
          alert("Code otp Error"); /* TODO: testear que no de problemas al esperar la resolución de la alerta */
          return throwError(() => err);})
      )
  }

showSubmitButton(code: string) {
  if (code.length === this.maxCodeLength) {
    this.showButton = true;
  } else {
    this.showButton = false;
  }
}

  ngOnInit(): void {
  }

}
