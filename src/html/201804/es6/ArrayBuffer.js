 var x = new Int8Array([1,1])
 var y = new Int8Array(x)
    console.log(x[0]);
    console.log(y[0]);
    x[0] = 2;
    console.log(y[0])


 var x1 = new Int8Array([1,1])
 var y1 = new Int8Array(x1.buffer);

 console.log(x1[0]);
 console.log(y1[0]);
 x1[0] = 2;
 console.log(y1[0])