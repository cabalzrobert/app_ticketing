//const{ Proxy }:any = window;

export const proxy = (object:any, fncs:any)=>{
    //console.log('S E R V I C E  C O N N E C T fncs', fncs);
    return new Proxy({},{ 
        get: get(object, fncs), 
        set: set(object),
    }); 
};
//helper
function get(object:any, fncs:any){
    return (target:any, key:string, value:any)=>{
        //console.log('S E R V I C E  C O N N E C T target', value);
        if(!!fncs[key]) return fncs[key];
        return object[key];
    };
}
function set(object:any){ 
    return (target:any, key:string, value:any)=>{
        return (object[key] = value), true; 
    }
}