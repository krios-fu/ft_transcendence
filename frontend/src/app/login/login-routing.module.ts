import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login.component";
import { TwofaComponent } from "./2fa/2fa.component";
import { AuthGuard } from "../guards/auth.guard";

const LoginRoutes: Routes = [

	{
		path: '',
		// pathMatch: 'full',
		component: LoginComponent
	},
	{
		path: '2fa',
		component: TwofaComponent,
		canActivate: [AuthGuard]
	}
]

@NgModule({
	imports: [RouterModule.forChild(LoginRoutes)],
	exports: [RouterModule,]
})
export class LoginRoutingModule { }
