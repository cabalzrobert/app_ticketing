// Angular Modules 
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ready } from '../tools/plugins/ready';
import { device } from '../tools/plugins/device';
import { storage } from '../tools/plugins/storage';
import { LocalStorageService } from '../tools/plugins/localstorage';
import { http } from '../tools/plugins/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

//const { http }: any = HttpClient;


export const rest = (() => {
    const localhost = 'localhost:8090';
    const path: string = '/app/v1/ticketingdashboard/';
    const httpLocalhost: string = ('http://' + localhost);
    const wsLocalhost: string = ('ws://' + localhost);

    const headers: any = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json-patch+json; application/json; charset=UTF-8;',
    };
    var authorization = '';
    const rest = {
        ready:ready(),
        setBearer: (bearer: string) => setBearer(bearer),
        post: (url: string, data: any = {}) => post(url, data),
        get: (url: string) => get(url),
        ws:(url:string='', includeBearer:boolean=false)=>ws(url,includeBearer),
        Post:(url:string, data:any={}, headers:any={})=>Post(url,data,headers),
        Get:(url:string, headers:any={})=>Get(url,headers),
        Download:(url:string, headers:any={})=>Download(url,headers),
        httpFullname:(url:string)=>httpFullname(url),
        endpoint:(url:string)=>endpoint(url)
    }
    device.ready(()=>setTimeout(async()=>{
        //var auth = (await storage.Auth||{});
        var auth = (await localStorage['Auth']||{})
        console.log('device.ready', auth);
        if(!!auth.Token){
            rest.setBearer(auth.Token);
        }/*else{
            auth = await(storage.Auth = {token:'123123123weqewqewq'});
            rest.setBearer(auth.token);
        }*/
        rest.ready();
    },475));
    return rest;
    function setBearer(bearer: string) {
        headers['Authorization'] = ('Bearer ' + (authorization = bearer));
        return rest;
    }
    function post(url: string, data: any) {
        console.log('res.service.tsx port', httpLocalhost + endpoint(url));
        return Post(httpLocalhost + endpoint(url), data, headers);
    }
    function get(url: string) {
        return http.get(url+ endpoint(url), headers);
    }
    function ws(url:string='', includeBearer:boolean=false){
        var url = endpoint(url);
        if(includeBearer) url += ('?token=' + authorization);
        return (wsLocalhost + url);
    }
    function Post(url:string, data:any={}, headers:any={}){
        console.log('res.service.tsx Post', url);
        //return http.post(url, data, { headers:headers });
        //const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return http.post(url,data,{headers:headers});
        //return this.http.post<any>(this.apiUrl + url, data, httpOptions )
    }
    function Get(url:string, headers:any={}){
        return http.get(url, {}, { headers:headers });
    }
    function Download(url:string, headers:any={}){
        return http.download(url, null, { headers:headers });
    }
    function httpFullname(url:string){
        return (httpLocalhost + (!url.startsWith('/')?'/':'') + url);
    }
    function endpoint(url:string){
        return (!!url?(url[0]=='/'?url:path+url):'');
    }
})();