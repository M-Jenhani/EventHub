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
  private notificationSubject = new BehaviorSubject<any>(null);
  public notification$ = this.notificationSubject.asObservable();
  private connected = false;

  connect(userEmail: string): void {
    if (this.connected) {
      return;
    }

    const token = localStorage.getItem('token');
    
    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP: ' + str);
      }
    });

    this.client.onConnect = () => {
      console.log('WebSocket connected for user:', userEmail);
      this.connected = true;
      
      this.client?.subscribe(`/user/queue/notifications`, (message) => {
        console.log('Received notification:', message.body);
        this.notificationSubject.next(message.body);
      });
    };

    this.client.onStompError = (frame) => {
      console.error('WebSocket error:', frame);
      this.connected = false;
    };

    this.client.onDisconnect = () => {
      console.log('WebSocket disconnected');
      this.connected = false;
    };

    this.client.activate();
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }
}
