import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, tap, throwError  } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

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


  confir(code: string) {
    this.http.post('http://localhost:3000/auth/2fa/validate', { token: code })
    .subscribe( ( user => { 
      console.log(user)
    }))
 
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
