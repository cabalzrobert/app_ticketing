import { timeout } from './delay';
import { mtCb } from './static';

export const ready = ()=>{
    const callbacks:any = {};
    var callbackKey = 0, isReady = false;
    return (callback:Function=mtCb)=>{
        //console.log('R E A D Y . T S 8', isReady );
        //console.log('R E A D Y . T S mtCb 9', mtCb );
        if(isReady) {return callback();}
        else if(!isReady&&callback!=mtCb){
            const key = (callbackKey++);
            //console.log('R E A D Y . T S key 13', key );
            return (callbacks[key] = { callback:callback });
        }
        isReady = true;
        timeout(()=>Object.values(callbacks).forEach((info:any)=>{
            //console.log('R E A D Y . T S info', info );
            info.callback()
        }));
    };
};
export const whenReady=(callback:(handler:()=>void)=>void, stack=false)=>{
    //console.log('whenReady 24', callback);
    const callbacks:any = [];
    var isReady = false, isPerforming = false;
    const handler=()=>{

        return()=>{
            //console.log('R E A D Y . T S return isReady', isReady );
            if(isReady)return;
            isPerforming = false;
            isReady = true
            callbacks.forEach((resolve:any)=>resolve(isReady));
        };
    };
    return async()=>{
        
        //console.log('R E A D Y . T S return async stack', stack );
        if(isReady)return true;
        const perform = isPerforming;
        isPerforming = true;
        if(!stack&&perform)return false;
        return await (new Promise((resolve:any)=>{
            //console.log('R E A D Y . T S return await', resolve );
            callbacks.push(resolve);
            if(perform)return;    
            callback(handler());
        }));
    };
};