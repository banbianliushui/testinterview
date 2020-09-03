var p1 = new Promise(function(resolve,reject){
  setTimeout(() => {
   reject(new Error('fail1'))
  }, 3000);
})

var p2 = new Promise(function(resolve,reject){
  setTimeout(() => {
    resolve(p1)
  }, 1000);
})
p2.then((result)=>{
  console.log('p then1',result)
})

p2.catch(err=>{
  console.log('p catch',err)
})