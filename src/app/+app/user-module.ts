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
    //console.log('jUser ls', ls.getItem('UserAccount'));
    //const untilReady = whenReady((ready) => device.ready(async () => (Object.create(jUser, (await ls.getItem('user') || jUser)), ready())), true);
    //const untilReady = whenReady((ready) => device.ready(async () => (Object.rcopy(jUser, (await ls.getItem('user') || jUser)), ready())), true);
    const untilReady = whenReady((ready) => device.ready(async () => (Object.assign(jUser, JSON.parse((await ls.getItem('UserAccount') || jUser))), ready())), true);
    return async (user: any = null, isMerge: boolean = false) => {
        await untilReady();
        //console.log('jUser', user);
        if (!user) {
            //console.log('if(!user)', jUser);
            return jUser;
        }
        //console.log('jUser 1', user);
        if (!isMerge){
            //console.log('if(!isMerge)', jUser);
            //return jUser = user;
            Object.assign(jUser, user);
        } 
        else{
            
            //console.log('else)', jUser);
            Object.assign(jUser, user);
        }
            

        //console.log('jUser 3', user);
        //await(localStorage["user"] = jUser);
        //console.log('jUser', Object);
        
        //await (jUser.ls.setItem('UserAccount', jUser));
        timeout(jUserModify);
        //console.log('jUser 4', user);
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

export const notificationCount=(()=>{ 
    const ready = whenReady((ready)=>rest.ready(()=>ready()));
    //console.log('Notification COunt', ready);
    var subscription:any;
    return async()=>{
        if(!await ready()) return;
        if(subscription) subscription.unsubscribe();
        //console.log('Notification COunt 81', ready);
        subscription = rest.post('notification/unseen').subscribe(async(res:any)=>{
            if(res.Status!='error'){
                return additionalNotification(+res, true);
            }
        },(err:any) =>{
            return additionalNotification(+0, true);
        });
   };
})();
export const additionalNotification=async(additional:number, isSet:boolean=false)=>{
   var user = await jUser();
   if(!user.NotificationCount) user.NotificationCount = 0;
   if(isSet) user.NotificationCount = additional;
   else user.NotificationCount += additional;
   //console.log('additionalNotification user', user);
   return await jUser(user,true);
}

export const getLastTransactionNumber=(()=>{ 
    const ready = whenReady((ready)=>rest.ready(()=>ready()));
    var subscription:any;
    return async()=>{
        if(!await ready()) return;
        if(subscription) subscription.unsubscribe();
        subscription = rest.post('lasttransactionno').subscribe(async(res:any)=>{
            if(res.Status!='error'){
                return bindLastTransacationNumber(res, true);
            }
        },(err:any) =>{
            return bindLastTransacationNumber('', true);
        });
   };
})();
export const bindLastTransacationNumber=async(transactionnumber:string, isSet:boolean=false)=>{
   var user = await jUser();
   if(!user.LastTransactionNo) user.LastTransactionNo = '';
   if(isSet) user.LastTransactionNo = transactionnumber;
   else user.LastTransactionNo = transactionnumber;
   return await jUser(user,true);
}
/*
export const departmentnotificationCount=(async ()=>{ 
    const ready = whenReady((ready)=>rest.ready(()=>ready()));
    //console.log('Notification COunt', ready);
    var user = await jUser();
    var subscription:any;
    return async()=>{
        if(!await ready()) return;
        if(subscription) subscription.unsubscribe();
        //console.log('Notification COunt 81', ready);
        subscription = rest.post(`head/notification/unseen?departmentID=${user.DEPT_ID}`).subscribe(async(res:any)=>{
            if(res.Status!='error'){
                return additionalDepartmentHeadNotification(+res, true);
            }
        },(err:any) =>{
            return additionalDepartmentHeadNotification(+0, true);
        });
   };
})();
export const additionalDepartmentHeadNotification=async(additional:number, isSet:boolean=false)=>{
    var user = await jUser();
    if(!user.DepartmentHeadNotificationCount) user.DepartmentHeadNotificationCount = 0;
    if(isSet) user.DepartmentHeadNotificationCount = additional;
    else user.DepartmentHeadNotificationCount += additional;
    //console.log('additionalNotification user', user);
    return await jUser(user,true);
 }
export const getLastForwardTransactionNumber=(()=>{ 
    const ready = whenReady((ready)=>rest.ready(()=>ready()));
    var subscription:any;
    return async()=>{
        if(!await ready()) return;
        if(subscription) subscription.unsubscribe();
        subscription = rest.post('lastforwardtransactionno').subscribe(async(res:any)=>{
            if(res.Status!='error'){
                return bindLastForwardTransactionNumber(res, true);
            }
        },(err:any) =>{
            return bindLastForwardTransactionNumber('', true);
        });
   };
})();
export const bindLastForwardTransactionNumber=async(LastForwardTransactionNo:string, isSet:boolean=false)=>{
   var user = await jUser();
   if(!user.LastForwardDeptTransactionNo) user.LastForwardDeptTransactionNo = '';
   if(isSet) user.LastForwardDeptTransactionNo = LastForwardTransactionNo;
   else user.LastForwardDeptTransactionNo = LastForwardTransactionNo;
   return await jUser(user,true);
}
   */
