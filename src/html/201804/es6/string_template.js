






function compile(template){
    //关键是 eval 计算某个字符串并执行其中的js代码。
    // 模板解析的时候可以将html代码部分和js代码部分合并成一个字符串，调用eval生成一个函数用于根据数据生成html代码并输出
    //1.提取js代码<% %>  js表达式<%= %> ,
    //

    const codeReg =/<%=(.+?)%>/g;
    const exprReg = /<%(.+?)%>/g;

    template = template.replace(codeReg,'`)\n code($1); \n code(`')
    .replace(exprReg,'`)\n $1 \n code(`');
    template='code(`'+template+'`)'
    //连接模板内容生成一个用于生成html的函数
    //把模板内容合成一个包含js代码和html字符串的待执行函数。
    //导入数据并解析
    var parse = `(function parse(data){
          var output="";   
        function code(str){
            output+=str;
        }
        ${template}        
        return output;
    })`;
    return parse;
}


//根据模板，生成并返回一个解析函数parse
//parse 需要定义一个存放代码的数组，静态代码和动态代码（js）都存，然后合并后返回，只要输入数据执行此函数会自动合成html并返回
function compile1(template){
    const evalReg = /<%=(.+?)%>/g;
    const exprReg = /<%(.+?)%>/g;

    template=  template.replace(evalReg,'\");  r.push($1);   r.push(\"')
        .replace(exprReg,'\");  $1  r.push(\"')
        .replace(/[\r\n]/g,"");

    template = 'r.push(\"'+template+'\");';
    // function parse(... 外部需要加小括号，表达式才会有返回值，不加小括号就表示声明了函数
    var parse = '(function parse(data){' +
        'var r = [];' +
        template+
        '' +
        '; return r.join("")' +
        '})';
    return parse;
}