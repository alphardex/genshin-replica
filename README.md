# 原神启动复刻

原项目地址：https://github.com/gamemcu/www-genshin

本着以学习为目的来复刻这个项目，以后可能会出一篇项目的技术要点分析文章。

框架方面，用`kokomi.js`代替原项目的`xviewer.js`，完全重写。

为一些实现要点添加了注释。

新增了调试功能，访问`/#debug`即可。

## 食用方法

安装依赖

```sh
npm i
```

本地调试

```sh
npm run dev
```

构建

```sh
npm run build
```

预览

```sh
npm run preview
```
