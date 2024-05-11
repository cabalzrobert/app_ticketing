import moment from 'moment';
import axios from 'axios';
import { Observable, Subscription } from 'rxjs';
import { device } from './device';

import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';

export const http=(()=>{
    //const provider = (device.isBrowser?provider0a:provider0b)();
    const provider = provider0a();
    //console.log('http.tsx prdevice.isBrowserovider', device.isBrowser);
    //console.log('http.tsx provider', provider);
    return {
        get:(url:string, params?:any, options:any={})=>provider.get(url,params,options)as Observable<any>,
        post:(url:string, params:any, options:any={})=>provider.post(url,params,options)as Observable<any>,
        download:(url:string, params?:any, options:any={})=>provider.download(url,params,options)as Observable<any>,
    };
    function provider0a(){
        const plugin = axios;//https://www.npmjs.com/package/axios
        return {
            get:(url:string, params?:any, options:any={})=>request('get',url, params,options),
            post:(url:string, params:any, options:any={})=>request('post',url, params,options),
            download:(url:string, params?:any, options:any={})=>download(url, params, options),
        };
        function request(method:string, url:string, params?:any, options:any={}){
            options.serializer = (!options.serializer?'json':options.serializer);
            options.responseType = (!options.responseType?'json':options.responseType);
            return Observable.create((observer:any)=>{
                var cancelToken:any = plugin.CancelToken.source();
                plugin.request({
                    method:(method as any),
                    url:url, data:params,
                    headers:(options.headers||{}),
                    responseType:options.responseType,
                    cancelToken:cancelToken.token,
                })
                .then((res)=>observer.next(response(options, res)))
                .catch(err=>observer.error({Status:'error',Message:err.message}))
                .finally(()=>observer.complete());
                return ()=>(!!cancelToken&&cancelToken.cancel());
            });
        }
        function response(options:any={}, response?:any){
            var body = null; 
            if(options.serializer=='raw'||options.responseType=='blob')
                body = response.data;
            else if(options.serializer=='json'||options.responseType=='json')
                body = response.data;
            else body = response.data;
            return body;
        }
        function download(url:string, params?:any, options:any={}){
            var catchError = false, isDone = false;
            return Observable.create((observer:any)=>{
                return !plugin.get(url,{
                    responseType: 'blob',
                    onDownloadProgress: (event) => {
                        if(isDone) return;
                        return observer.next({ 
                            type: 'progress',  
                            loaded: event.loaded,  
                            total: event.total,  
                            percentage: Math.round(100 * (event.loaded / (event.total || 1))),
                        });
                    }
                })
                .then((res)=>{
                    isDone = true;
                    observer.next({ 
                        type: 'completed', 
                        status: 'success',
                        body: new Blob([res.data]) //body: event.body 
                    });
                    observer.complete();
                })
                .catch(err=>{
                    catchError = true;
                    observer.error({ type:'download', status:'failed', error:err });
                    observer.complete();
                });
            });
        }
    }
})();