const assert = require('assert');

const obj1 = {
    a: {
        b: 1
    }
};
const obj2 = {
    a: {
        b: 2
    }
};
const obj3 = {
    a: {
        b: 1
    }
};
const obj4 = Object.create(obj1);
/*assert.deepEqual(obj1, obj4)*/
//assert.deepEqual(NaN, NaN);
//assert.deepStrictEqual(NaN, NaN);

var set1 = new Set([1,4,5])
var set2 = new Set([4,1,5])
//assert.deepStrictEqual(set1, set2);

/*
(async () => {
    await assert.doesNotReject(
        async () => {
            throw new TypeError('错误信息');
        },
        SyntaxError
    );
})();
*/

/*
assert.doesNotReject(Promise.reject(new TypeError('错误信息')))
    .then(() => {
        // ...

    });*/

/*
(async () => {
    await assert.rejects(
        async () => {
            throw new TypeError('错误信息');
        },
        {
            name: 'TypeError',
            message: '错误信息11'
        }
    );
})();*/

/*
const err = new TypeError('错误信息1')
err.code= 404
err.foo = 'bar';
err.info={
    nested:true,
    baz:'text'
}

err.reg=/abc/i;
assert.throws(
    () =>{
        throw err;
    },
   function (err) {
       console.log(err)
   }
)*/

const err = new TypeError('错误信息');
err.code = 404;
err.foo = 'bar';
err.info = {
    nested: true,
    baz: 'text'
};
err.reg = /abc/i;

assert.throws(
    () => {
        throw err;
    },
    {
        name: 'TypeError',
        message: '错误信息',
        foo:'re',
        info: {
            nested: true,
            baz: 'text'
        }
        // 注意，只有校验对象的属性会被测试。
        // 使用嵌套的对象必须提供全部属性，否则校验会失败。
    }
);