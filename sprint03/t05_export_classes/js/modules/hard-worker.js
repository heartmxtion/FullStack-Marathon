let worker;
    class HardWorker{
   name;                     
   get age(){
      return this._age;
   }
   set age(value){
       if(value > 100){
           return value = 50
       }
       this._age = value;
   }
   get salary(){
       return this._salary;
   }
   set salary(value){
       if(value >= 100 && value < 10000){
           return this._salary = value
       } 
   }
   toObject(){
    return {name:this.name, age:this.age, salary:this._salary}
   }
}


   
worker = new HardWorker;
worker.name = 'Bruce';
console.log(worker.name);
// Bruce
worker.age = 50;
worker.salary = 1500;
console.log(worker.toObject());
// Object { name: "Bruce", age: 50, salary: 1500 }
worker.name = 'Linda';
worker.age = 140;
worker.salary = 15099000;
console.log(worker.toObject());
// Object { name: "Linda", age: 50, salary: 1500 }
    
    
export { HardWorker };
    