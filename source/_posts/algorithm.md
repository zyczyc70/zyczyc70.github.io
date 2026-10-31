---
slug: algorithm
title: 算法
date: 2023-08-29
tags:
  - 算法
categories:
  - 算法
cover: /img/cover/cover5.webp
---
# 数据结构与算法JAVA版

## 1.2二分查找

Basic  
需求：在有序数组A内，查找值target

-   如果找到返回索引
-   如果没有找到返回-1

算法描述

前提

给定一个内含n个元素的有序数组A，满足A0<A1<A2···An-1，一个待查值target

1

设置i=0，j=n-1

2

如果i>j，结束查找，没找到

3

设置m=floor(i+j/2)，m为中间索引，floor 是向下取整 (<=i+j/2的最小整数)

4

如果target<A\[m\]设置j=m-1，跳到第2步

5

如果A\[m\]<target设置i=m+1，跳到第2步

6

如果A\[m\]=target，结束查找，找到了

```java

public static int binarySearchBasic(int[] A, int target) {
    int i = 0, j = A.length - 1;
    while (i <= j) {
        int m = (i + j) / 2;
        if (target < A[m]) {
            j = m - 1;
        } else if (A[m] < target) {
            i = m + 1;
        } else {
            return m;
        }
    }
    return -1;
}

```
