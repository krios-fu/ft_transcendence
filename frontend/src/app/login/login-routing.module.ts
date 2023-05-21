import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login.component";
import { OtpSessionComponent } from "./otp-session/otp-session.component";


const LoginRoutes: Routes = [

	{
		path: '',
		// pathMatch: 'full',
		component: LoginComponent
	},
	{
		path: '2fa',
		component: OtpSessionComponent
	}


]

@NgModule({
	imports: [RouterModule.forChild(LoginRoutes)],
	exports: [RouterModule,]
})
export class LoginRoutingModule { }