import { RxStomp } from "@stomp/rx-stomp";
import { WebSocket } from 'ws';
import { rest } from "../../+services/services";

Object.assign(global, { WebSocket});

const rxStomp = new RxStomp();
rxStomp.configure({
  brokerURL: rest.ws('ws', true),
});

rxStomp.activate();

const subscription = rxStomp
  .watch({ destination: "/topic/test-rx" })
  .subscribe((message) => console.log(message.body));

rxStomp.publish({
  destination: "/topic/test-rx",
  body: "First message to RxStomp",
});

setTimeout(async () => {
  subscription.unsubscribe();
  await rxStomp.deactivate();
}, 3000);