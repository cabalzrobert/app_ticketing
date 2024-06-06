import { Plugins, Capacitor as capacitor } from '@capacitor/core';
import { ready } from './ready';
const{ Device } = Plugins;
const{ Object }:any = {};

export const device:any=(()=>{
    
    //console.log('Device Platform', capacitor);
    var device:any = { 
        ready:ready(),
        isBrowser:(capacitor.platform=='web'),
        isAndroid:(capacitor.platform=='android'),
        isIOS:(capacitor.platform=='ios'),
    };
    //console.log(Capacitor);
    setTimeout(async()=>{
        //Object.rcopy(device, await Device.getInfo());
        //device.isAndroid = (device.platform=='android'); 
        //device.isIOS = (device.platform=='ios'); 
        console.log('device.ts setTimeout', capacitor.platform);
        device.isBrowser = (capacitor.platform=='web');
        //BackgroundMode.enable();
        device.ready();
    });
    console.log('device.ts device', device)
    return device;
})();