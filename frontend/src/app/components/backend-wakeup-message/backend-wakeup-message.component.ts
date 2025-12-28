import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-backend-wakeup-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './backend-wakeup-message.component.html',
  styleUrls: ['./backend-wakeup-message.component.scss']
})
export class BackendWakeupMessageComponent {
  @Input() show = false;
}
