# checkData
Restful API中的请求和返回的数据类型检查。

## checkData API

methods   | describe     | options
----------|--------------|------------------------
`init`    | 初始化校验规则  | `{rule1:{}, rule2: {}}`
`add`     | 增加校验规则    | `{rule1:{}}`
`test`    |应用规则返回布尔值| `'rule1', data`
`use`     |应用规则返回对象  | `'rule1', data`
`clear`   | 清除规则       | `'rule1' || 不传参清除所有`

*注意：*

```code
当data和rule出现如下情况时：
    data = {}
    or
    data = null

    rule = {
        name: 'reamd',
        age: 18
    }

默认校验通过，不再校验name和age。
```