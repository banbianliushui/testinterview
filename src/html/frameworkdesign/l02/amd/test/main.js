require.config({paths:{
  math1:'./test/math1.js'
}})

require(['math1'],function(math){
  console.log(math.add(1,2,4))
  return {}
})