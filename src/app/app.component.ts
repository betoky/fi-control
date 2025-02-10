import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AlertService } from './services/alert/alert.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent {
  private messageService = inject(MessageService);
  private alertService = inject(AlertService);

  constructor() {
    this.alertService.message$.subscribe({
      next: ({ message, type }) => {
        this.messageService.add({
          severity: type,
          summary: type === 'error' ? 'Erreur' : 'Succès',
          detail: message,
          life: 3000
        })
      }
    })
  }

}

