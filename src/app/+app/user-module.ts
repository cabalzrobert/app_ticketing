import { Observable, Subscription } from "rxjs";
import { mtCb, subscribe } from "../tools/plugins/static";
import { storage } from "../tools/plugins/storage";
import { rest } from "../+services/services";
import { timeout } from "../tools/plugins/delay";
import { whenReady } from "../tools/plugins/ready";
import { device } from "../tools/plugins/device";
import { LocalStorageService } from "../tools/plugins/localstorage";
import { Inject, InjectionToken, inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
interface Window {
    Object:any;
  }

//const { ls }: any = LocalStorageService;
export const jUser = (() => {
    const ls = LocalStorageService;
    //const ls:any = LocalStorageService
    //var ls:LocalStorageService;
    var jUser: any = {};
    console.log('jUser ls', ls);
    //const untilReady = whenReady((ready) => device.ready(async () => (Object.rcopy(jUser, (await storage.user || jUser)), ready())), true);
    const untilReady = whenReady((ready) => device.ready(async () => (Object.assign(jUser, (await  ls.getItem('user') || jUser)), ready())), true);
    return async (user: any = null, isMerge: boolean = false) => {
        await untilReady();
        if (!user) return jUser;
        if (!isMerge) return jUser = user;
        else
            Object.assign(jUser, user);
        //await(localStorage["user"] = jUser);
        await (jUser.ls.setItem('user', jUser));
        timeout(jUserModify);
        return jUser;
    }
})();
export const jUserModify = (() => {
    const callbacks: any = {};
    var callbackKey = 0;
    return (callback: Function = mtCb, apply: boolean = true): Subscription => {
        if (callback == mtCb)
            return (Object.values(callbacks).forEach((cb: any) => timeout(cb)) as any);
        const key = (callbackKey++);
        callbacks[key] = callback;
        if (apply) callback();
        return subscribe(() => () => delete callbacks[key]);
    }
})();
