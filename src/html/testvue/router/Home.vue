
<script>
export default{
    computed:{
        username(){
            return this.$route.params.username
        }
    },
    methods:{
        goBack(){
            window.history.length>1?this.$router.go(-1)
                :this.$router.push('/');

        }
    }
}
</script>