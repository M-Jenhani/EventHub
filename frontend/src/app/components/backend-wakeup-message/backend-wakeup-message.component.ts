import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-backend-wakeup-message',
  standalone: true,
  templateUrl: './backend-wakeup-message.component.html',
  styleUrls: ['./backend-wakeup-message.component.scss']
})
export class BackendWakeupMessageComponent {
  @Input() show = false;
}
