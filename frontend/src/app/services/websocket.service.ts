import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private client?: Client;
  private notificationSubject = new BehaviorSubject<string>('');
  public notification$ = this.notificationSubject.asObservable();

  connect(userEmail: string): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('WebSocket connected');
      this.client?.subscribe(`/user/queue/notifications`, (message) => {
        this.notificationSubject.next(message.body);
      });
    };

    this.client.onStompError = (frame) => {
      console.error('WebSocket error:', frame);
    };

    this.client.activate();
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
    }
  }
}
