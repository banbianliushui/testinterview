/**
 * Created by xiaozhu on 2018/4/27.
 */
require.config({

    paths : {
//		"jquery" : [ "http://apps.bdimg.com/libs/jquery/1.11.3/jquery.min", "js/jquery" ],
        "a" : [ "./a" ],
        "b" : "./b"
    }
});

require(["a","b"],function(a,b){
    console.log(b.name)
})