import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent {

  username: any | null;
  roleName: string | null;

  constructor(private authService: AuthService) {
    this.roleName=authService.getRole;
    this.username = authService.getUsername;
  }
}
