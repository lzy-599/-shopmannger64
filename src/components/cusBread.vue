<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
// 封装技巧
// 1. 重复代码直接函数体、
// 2. 变化的量 -> 形参
export default {
  name: "CusBread",
  // 前提：data中的数据特点-值只能来源于本身
  //  1. 数据的声明来源于外部，此时数据声明不能写在data中
  //  2. 应该把数据声明写在选项props
  //  3. props的值可以是字符串的数组
  //  4. props中的数据level1和level2用法和data用法一样
  //  5. props中的数是数据的声明
  //  6. props中的数据将来就是组件的属性，也是自定义标签的属性
  //  7. props中的数据将来使用组件时通过属性进行赋值
  props: ["level1", "level2"]
};
</script>

<style>
</style>
