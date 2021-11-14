const fs = require('fs');
const path = require('path');
const parse = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const balel = require('@babel/core');

function getModuleInfo(file) {
    


    //读取文件

    const body = fs.readFileSync(file, 'utf-8');
    console.log(body.toString());

    const ast = parse.parse(body, {
        sourceType: 'module'
    })

    // 收集依赖

    const deps = {};
    traverse(ast, {
        // visitor
        ImportDeclaration({node}) {
            const dirname = path.dirname(file)
            const abspath = './' + path.join(dirname, node.source.value)
            deps[node.source.value] = abspath;
        }
    });

    // Es5转换
    const {code} = balel.transformFromAst(ast, null, {
        presets: ['@babel/preset-env']
    });

    const info = {
        file,
        deps,
        code
    }

    return info;
}


const info = getModuleInfo('./src/index.js');
console.log(info, '1234');