import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  IsLoggin:any=false;
  roleName: string | null;
  username: any | null;
  constructor(private authService: AuthService, private router:Router)
  {
   
    this.IsLoggin=authService.getLoginStatus;
    this.roleName=authService.getRole;
    if(this.IsLoggin==false)
    {
      this.router.navigateByUrl('/login'); 
    
    }
    this.username = authService.getUsername;
  }
  logout()
{
  this.authService.logout();
  window.location.reload();
}

}