---
slug: java
title: java
date: 2023-08-31
tags:
  - java
categories:
  - java
cover: /img/cover/cover1.webp
---
# Java SE

## 基础

### 类和接口

#### 对象Object

java 是面向对象的语言：对象包含了状态和行为，用户通过调用对象的方法、改变对象的属性来实现 java 程序的功能。  

```java
Car myCar = new Car("BMW");     
me.brand = "Benz";   
me.go("London");  
```

  
在 java 程序中我们通过类和接口来定义对象的性质：每个 java 文件都是一个定义好的 public 类 / 接口，且类名 / 接口名与文件名相同。

*java 文件可以含有多个类 / 接口，但只能有一个 public 类 / 接口供外部访问。*

#### 类 Class

对象的类型：定义对象含有的变量和方法。  

```java
public class Car {     
    
    String brand;
    String description = "this is a car";
    
    static int number_of_car;  
    
    public car(String brand){        
        this.brand = brand;
    } 
    
    public void go(String loc){
        System.out.print("go to" + loc);
    }   
    
    void static showNum(){            
        System.out.print(number_of_car);
    }
    
    {       
        number_of_car;                                      
    }
    
    static{                                                              
        number_of_car = 0;
    }
    
    public class Warranty{
        public void repair(){
            System.out.print("repair");
        }    
    }
}
```

-   变量  
    对象中存储的数据
