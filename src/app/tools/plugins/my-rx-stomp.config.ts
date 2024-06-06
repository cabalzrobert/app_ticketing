import { RxStompConfig } from "@stomp/rx-stomp";
import { rest } from "../../+services/services";

export const myRxStompConfig: RxStompConfig = {
    brokerURL: rest.ws('ws', true),
    heartbeatIncoming: 0, // Typical value 0 - disabled
    heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds
    reconnectDelay: 200,
    debug: (msg: string): void => {
        console.log(new Date(), msg);
    },
}