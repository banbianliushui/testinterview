$(function(){
    $("ul").on('click','a',function(){
        var href =   $(this).attr('ahref');
        var moduleid =   $(this).attr('moduleid');
        var linkto =   $(this).attr('linkto');// url, params, callback
       /* var init =eval(moduleid+'.init');
        init();*/
        //controller.notify('init',moduleid,moduleid)
        $("#container div").removeClass('active');
        $('#'+linkto).addClass('active');

        $("#"+linkto).load('http://localhost:63342/testinterview/src/html/201802/navcontroller/'+href+'.html',{},function(){
            pubsub.notify('init',moduleid,moduleid)
        })

    })
})