class Promise{
    constructor(resolver){
     this.resolver = resolver
    }
    then() {
     console.log('then');
    }
    resolve(){
        console.log('resolve');
    }
    reject(){
        console.log('reject');
    }
}


let p = new Promise()
p.then()