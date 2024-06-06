import { Inject, Injectable } from "@angular/core";
import { RxStomp } from "@stomp/rx-stomp";
import { useEffect, useRef } from "react";
import { rest } from "../../+services/services";
import { debug } from "console";
@Injectable({
    providedIn: 'root',
})
export class RxStompService extends RxStomp {
    constructor() {
        super();
    }
}

