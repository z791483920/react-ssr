import MemoryFs from 'memory-fs';
import Module from 'module';
import vm from 'vm';

// const mfs = new MemoryFs();
// mfs 主要获取在开发环境时内存中的文件 在线上时只需要读取本地静态资源即可
// const m = new Module();

// 第一种;
// const getModuleFromString = (content, filename) => {
//   // 获取代码串 第三种方法
//   // 读取内容并转成String类型

//   //上层content获取逻辑 获取 webpackServerConfig.output.path 以及 模块地址
//   //const renderPath = path.join(webpackServerConfig.output.path, 'index.js');
//   //const content = mfs.readFileSync(renderPath, 'utf-8').toString();

//   // 因为读取的是js文件，所以直接执行可以获取到输出的内容
//   m._compile(content, filename);
//   return m.exports;
// };

// 第二种
const getModuleFromString = (content, filename) => {
    const m = { exports: {} };
    const wrapper = Module.wrap(content); // 这一步将bundle 包装成`(function (exports, require, module, __filename, __dirname){ bundle code  })`模式 commonjs

    const script = new vm.Script(wrapper, {
        filename,
        displayErrors: true
    });
    const result = script.runInThisContext(); // 此处可以指定代码的执行环境，此api在nodejs文档中有介绍
    result.call(m.exports, m.exports, require, m); // 执行wrapper函数，此处传入require就解决了第一种方法不能require的问题
    return m.exports;
};

// const getModuleFromString = (content, filename) => {
//   // 获取代码串 第三种方法
//   // 读取内容并转成String类型
//   //上层content获取逻辑 获取 webpackServerConfig.output.path 以及 模块地址
//   //const renderPath = path.join(webpackServerConfig.output.path, 'index.js');
//   //const content = mfs.readFileSync(renderPath, 'utf-8').toString();
//   // 因为读取的是js文件，所以直接执行可以获取到输出的内容
//   // new Function 找不到module 所以改用eval，由于在后端所以避免了风险
//   bundle = eval(content).default ? eval(content).default : eval(content);
//   return bundle;
// };

export default getModuleFromString;
