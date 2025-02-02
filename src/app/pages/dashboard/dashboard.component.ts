import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth/auth.service';
import { HomeService } from '../../services/home/home.service';

@Component({
  selector: 'app-dashboard',
  imports: [ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private homeService = inject(HomeService);

  ngOnInit() {
    this.homeService.hasHome()
      .then(data => console.log(data))
      .catch(e => console.error(e))
  }

  onLogout() {
    this.authService.logout();
  }

}
