<template>
    <div class="post">
        <div class="loading" v-if="loading">
            Loading
        </div>
        <div v-if="error" class="error">
            {{error}}
        </div>
        <div v-if="post" class="content">
            <h2>{{post.title}}</h2>
            <p>{{post.body}}</p>
        </div>
    </div>
</template>
<script>
export default{
    data(){
        return {
            loading:false,
            post:null,
            error:null

        }
    },
    created(){//导航完成后获取数据
        this.fetchData()
    },
    watch :{
        '$route':'fetchData'
    },
    methods:{
        fetchData(){
            this.error = this.post = null;
            this.loading = true;
            setTimeout(function(){
                this.loading = false;
                this.post =[{title:'js 原理',body:"<div></div>这里是对象"},
                    {title:'js 秘密',body:'你所不知道的js'}]
            })
       /* getPost(this.$route.params.id,(err,post) =>{
                this.loading = false;
                if(err){
                    this.error = err.toString()
                }else{
                    this.post = post
                }
            })*/
        }
    }
}
</script>