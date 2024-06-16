
import { ready } from '../tools/plugins/ready';
import { proxy } from '../tools/plugins/proxy';
import { stomp as service } from '../tools/plugins/stomp';
import { rest } from './services';
import { LocalStorageService } from '../tools/plugins/localstorage';

export const stomp = (() => {
    //console.log('export const stomp');
    //const _ = service('');
    var token:any = {}
    let _token:string | undefined;
    if (typeof localStorage !== 'undefined'){
        token = localStorage.getItem('Auth');
        // console.log('stomp.servive.ts', JSON.parse(token).Token);
        // _token = JSON.parse(token).Token;
        // console.log('stomp.servive.ts _token', _token)
        
    }
   
        
    const _ = service(rest.ws('ws', true));
    //console.log('Stomp');
    const stomp = proxy(_, {
        ready: ready(),
        refresh: () => {
            _.setUrl(rest.ws('ws', true))
        },
    });
    rest.ready(async () => {
        stomp.refresh();
        stomp.ready();
    });
    return stomp;
})();