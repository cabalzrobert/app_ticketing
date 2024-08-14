import { Plugins } from '@capacitor/core';
import { LocalStorageService } from './localstorage';
import { device } from './device';
import { ready } from './ready';
import { mtPCb, mtObj } from './static';

const{ Storage  }: any = Plugins;
const{ Proxy }:any = window;

export const storage = (()=>{
    const provider = (device.isBrowser?provider0a:provider0b)();
    const storage = { ready:ready(), }
    return new Proxy(storage,{
        get: async function (target:any, key:string, value:any) {
            await provider.getItem(key); // release possible old data
            var data = await provider.getItem(key);
            
            return (data==undefined?undefined:JSON.parse(data));
        },
        set: async function (target:any, key:string, value:any) {
            await provider.setItem(key, JSON.stringify(value));
        }
    });
    function provider0a(){
        const plugin = Storage;
        return ({
            getItem:async(key:string)=>{
                return ((await plugin.get({key:key}))||mtObj).value;
            },
            setItem:async(key:string, value:string)=>{
                return await plugin.set({key:key,value:value});
            },
        });
    }
    function provider0b(){
        const plugin = localStorage;
        return ({
            getItem:async(key:string)=>new Promise<any>((resolve)=>{
                //return plugin.getItem(key).then(resolve,()=>resolve(undefined));
                return plugin.getItem(key);
            }),
            setItem:async(key:string, value:string)=>{
                return await plugin.setItem(key,value);
            },
        });
    }
})();