import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, tap, throwError  } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-otp-session',
  templateUrl: './otp-session.component.html',
  styleUrls: ['./otp-session.component.scss']
})
export class OtpSessionComponent implements OnInit {
  maxCodeLength = 6;
  showButton = false;

  constructor(private http: HttpClient,
    private authService: AuthService,) {


  }


  confir(code: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(environment.apiUrl + '/auth/2fa/validate', { token: code }).pipe(
      tap( (res: any) => {
        this.authService.redirectHome();
      }),
      catchError((err: HttpErrorResponse) => {

        alert("Code otp Error");
        return throwError(() => err);})
    )
  }

//   confimateOtp(code: any) {
//     // console.log("Code 2fa:", code);
    
//     this.confir(code).subscribe( (lol: any) => {
//       console.log("ESTOY");
//       console.log(lol)})
// }

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
