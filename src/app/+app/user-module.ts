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
// interface Window {
//     Object:any ;
//   }
declare global {
    interface Window { jUser: any; }
}

//const { ls }: any = LocalStorageService;
//window.jUser = window.jUser || {}
export const jUser = (() => {
    const ls = LocalStorageService;
    //const Object:Window = window;
    //const ls:any = LocalStorageService
    //var ls:LocalStorageService;
    var jUser: any = {};
    //var Object1:any = window;
    //console.log('jUser ls', ls);
    //const untilReady = whenReady((ready) => device.ready(async () => (Object.create(jUser, (await ls.getItem('user') || jUser)), ready())), true);
    //const untilReady = whenReady((ready) => device.ready(async () => (Object.rcopy(jUser, (await ls.getItem('user') || jUser)), ready())), true);
    const untilReady = whenReady((ready) => device.ready(async () => (Object.assign(jUser, JSON.parse((await ls.getItem('UserAccount') || jUser))), ready())), true);
    return async (user: any = null, isMerge: boolean = false) => {
        await untilReady();
        console.log('jUser', user);
        if (!user) {
            //console.log('if(!user)', jUser);
            return jUser;
        }
        console.log('jUser 1', user);
        if (!isMerge){
            //console.log('if(!isMerge)', jUser);
            return jUser = user;
        } 
        else{
            
            //console.log('else)', jUser);
            Object.assign(jUser, user);
        }
            

        //console.log('jUser 3', user);
        //await(localStorage["user"] = jUser);
        //console.log('jUser', Object);
        await (jUser.ls.setItem('user', jUser));
        timeout(jUserModify);
        console.log('jUser 4', user);
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
