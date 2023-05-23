import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
	providedIn: 'root'
})
export class ChatService{
	constructor(
		private http: HttpClient,
	){}

	createChat(id_friend: number){
		return this.http.post(environment.apiUrl + '/chat/me', {
			friendId : id_friend
		})
	}

	
}