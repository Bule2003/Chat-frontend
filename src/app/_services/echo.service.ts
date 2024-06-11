import { Injectable } from '@angular/core';
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { environment } from '@environments/environment';
import {AccountService} from "@app/_services/account.service";

@Injectable({
  providedIn: 'root'
})
export class EchoService {
  token = localStorage.getItem('access_token');

  constructor(public accountService: AccountService) {
    /*const pusher = new Pusher('47b17929641671169853', {
      cluster: 'eu',
      forceTLS: true,

      auth: {
        headers: {
          Authorization: `Bearer ${this.token}`,
        }
      }
    });

    const channel = pusher.subscribe(channel);
    channel.bind('MessageSent', function(data: any) {
      alert(JSON.stringify(data));
    });*/

    /*new Pusher("app_key", { channelAuthorization: { endpoint: "/pusher_auth.php"}  });*/ // may help


    if (!Pusher) {
      throw new Error('Pusher is not loaded correctly');
    }

    window.Pusher = Pusher;

    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: environment.PUSHER_APP_KEY,
      cluster: environment.PUSHER_APP_CLUSTER,
      secret: environment.PUSHER_APP_SECRET,
      /*client: 'pusher',*/
      encrypted: true,
      /*forceTLS: true,*/
      /*authEndpoint: 'http://localhost:4200/broadcasting/auth',*/
      authEndpoint: `http://127.0.0.1:8000/broadcasting/auth`,


      auth: {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json'
        },
        params: (socketId: string, channelName: string) => {
          return {
            socket_id: socketId,
            channel_name: channelName
          };
        }
      }
    });

    Pusher.logToConsole = true;

  }

  public listen(channel: string, event: string, callback: (data: any) => void): void {
    const channelInstance = window.Echo.private(channel);
    console.log('Token', this.token);

    channelInstance.subscribed(() => {
      console.log(`Subscribed to channel ${channel}`);
    });

    channelInstance.error((error: any) => {
      console.error(`Error subscribing to channel ${channel}`, error);
    });

    console.log('Start listening to event ', event);
    channelInstance.listen(event, (data: any) => {
      console.log(`Event ${event} received on channel ${channel}`, data);
      callback(data);
    });

  }
}
