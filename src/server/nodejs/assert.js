/**
 * Created by xiaozhu on 2018/7/1.
 */
const assert = require('assert');

var a = 1;
var b = 2;
assert(a==b,'a==b ?')

/*

// 生成一个 AssertionError，用于比较错误信息：
const { message } = new assert.AssertionError({
    actual: 1,
    expected: 2,
    operator: 'strictEqual'
});

// 验证输出的错误：
try {
    assert.strictEqual(1,2);
} catch (err) {
    console.log(err)
    assert(err instanceof assert.AssertionError);
    assert.strictEqual(err.message, message);
    assert.strictEqual(err.name, 'AssertionError [ERR_ASSERTION]');
    assert.strictEqual(err.actual, 1);
    assert.strictEqual(err.expected, 2);
    assert.strictEqual(err.code, 'ERR_ASSERTION');
    assert.strictEqual(err.operator, 'strictEqual');
    assert.strictEqual(err.generatedMessage, true);
}*/
