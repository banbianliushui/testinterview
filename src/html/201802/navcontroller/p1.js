var p1 = {
    init:function(){

    },
    beforeload:function() {
        this.data = [{id: 1, name: 'hahah'}]
        $("#pp1").html(JSON.stringify( this.data))
    }
}
