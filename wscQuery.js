//自定义的事件绑定，兼容IE和Firefox
function myAddEvent(obj, sEv, fn)
{
    if(obj.attachEvent)//兼容IE
    {
        obj.attachEvent('on'+sEv, function (){
            if(false==fn.call(obj))//这里用call是因为IE下事件绑定函数的this会丢失。
            {
                event.cancelBubble=true;
                return false;
            }
        });
    }
    else
    {
        obj.addEventListener(sEv, function (ev){
            if(false==fn.call(obj))
            {
                ev.cancelBubble=true;
                ev.preventDefault();
            }
        }, false);
    }
}

//类名选择器，oParent下面的element节点，的class属性遍历 
function getByClass(oParent, sClass)
{
    var aEle=oParent.getElementsByTagName('*');
    var aResult=[];
    for(var j=0,j_length = aEle.length;j<j_length;j++){
        // 为了class="a b";
        var sClass_arr = aEle[j].className.split(' ');
        for(var i=0;i<sClass_arr.length; i++){
            if(sClass_arr[i]==sClass)
            {
                aResult.push(aEle[j]);
            }
        }

    }
    return aResult;
}

//获取计算过的最终样式，兼容IE
function getStyle(obj, attr)
{
    if(obj.currentStyle)
    {
        return obj.currentStyle[attr];
    }
    else
    {
        return getComputedStyle(obj, false)[attr];
    }
}

//入口函数，也就是主函数
function wscQuery(vArg)
{
    this.elements=[];//用来保存选中的元素
    
    switch(typeof vArg)
    {
        case 'function'://如果传入参数是方法，则进行window.onload事件加载。TODO:下次得DOMContentLoaded事件加载
            myAddEvent(window, 'load', vArg);
            break;
        case 'string'://如果传入参数是字符串，则成为css选择器。TODO:完善CSS选择器的实现
            switch(vArg.charAt(0))
            {
                case '#':   //ID选择器
                    var obj=document.getElementById(vArg.substring(1));
                    
                    this.elements.push(obj);
                    break;
                case '.':   //class类名选择器
                    this.elements=getByClass(document, vArg.substring(1));
                    break;
                default:    //html标签选择器
                    this.elements=document.getElementsByTagName(vArg);
            }
            break;
        case 'object':
            this.elements.push(vArg);
    }
}

//点击事件
wscQuery.prototype.click=function (fn)
{
    var i=0;
    
    for(i=0;i<this.elements.length;i++)//为了标签选择器返回的数组，加事件
    {
        myAddEvent(this.elements[i], 'click', fn);
    }
    
    return this;
};

wscQuery.prototype.show=function ()
{
    var i=0;
    
    for(i=0;i<this.elements.length;i++)
    {
        this.elements[i].style.display='block';
    }
    
    return this;
};

wscQuery.prototype.hide=function ()
{
    var i=0;
    
    for(i=0;i<this.elements.length;i++)
    {
        this.elements[i].style.display='none';
    }
    
    return this;
};

//鼠标移入移出事件
wscQuery.prototype.hover=function (fnOver, fnOut)
{
    var i=0;
    
    for(i=0;i<this.elements.length;i++)
    {
        myAddEvent(this.elements[i], 'mouseover', fnOver);
        myAddEvent(this.elements[i], 'mouseout', fnOut);
    }
    
    return this;
};

wscQuery.prototype.css=function (attr, value)
{
    if(arguments.length==2) //设置样式
    {
        var i=0;
        
        for(i=0;i<this.elements.length;i++)
        {
            this.elements[i].style[attr]=value;
        }
    }
    else    //获取样式
    {
        if(typeof attr=='string')
        {
            return getStyle(this.elements[0], attr);
        }
        else//如果参数attr是{'width':'200px','height':'300px'}
        {
            for(i=0;i<this.elements.length;i++)
            {
                var k='';
                
                for(k in attr)
                {
                    this.elements[i].style[k]=attr[k];
                }
            }
        }
    }
    
    return this;//链式操作
};

wscQuery.prototype.attr=function (attr, value)
{
    if(arguments.length==2)//两个参数，设置属性
    {
        var i=0;
        
        for(i=0;i<this.elements.length;i++)
        {
            this.elements[i][attr]=value;
        }
    }
    else//一个参数返回属性值
    {
        return this.elements[0][attr];
    }
    
    return this;//链式操作
};

//点击切换函数绑定事件
wscQuery.prototype.toggle=function ()
{
    var i=0;
    var _arguments=arguments;
    
    for(i=0;i<this.elements.length;i++)
    {
        addToggle(this.elements[i]);
    }
    
    function addToggle(obj)
    {
        var count=0;
        myAddEvent(obj, 'click', function (){
            _arguments[count++%_arguments.length].call(obj);//通过取余数运算，来依次绑定点击事件
        });
    }
    
    return this;
};

//返回第n个元素
wscQuery.prototype.eq=function (n)
{
    return $(this.elements[n]);
};

function appendArr(arr1, arr2)
{
    var i=0;
    
    for(i=0;i<arr2.length;i++)
    {
        arr1.push(arr2[i]);
    }
}

wscQuery.prototype.find=function (str)
{
    var i=0;
    var aResult=[];
    
    for(i=0;i<this.elements.length;i++)
    {
        switch(str.charAt(0))
        {
            case '.':   //class
                var aEle=getByClass(this.elements[i], str.substring(1));
                
                aResult=aResult.concat(aEle);
                break;
            default:    //标签
                var aEle=this.elements[i].getElementsByTagName(str);
                
                //aResult=aResult.concat(aEle);
                appendArr(aResult, aEle);
        }
    }
    
    var newQuery=$();
    
    newQuery.elements=aResult;
    
    return newQuery;
};

function getIndex(obj)
{
    var aBrother=obj.parentNode.children;
    var i=0;
    
    for(i=0;i<aBrother.length;i++)
    {
        if(aBrother[i]==obj)
        {
            return i;
        }
    }
}

wscQuery.prototype.index=function ()
{
    return getIndex(this.elements[0]);
};

wscQuery.prototype.bind=function (sEv, fn)
{
    var i=0;
    
    for(i=0;i<this.elements.length;i++)
    {
        myAddEvent(this.elements[i], sEv, fn);
    }
};

wscQuery.prototype.extend=function (name, fn)
{
    wscQuery.prototype[name]=fn;
};

//把wscQuery函数封装成$函数
function $(vArg)
{
    return new wscQuery(vArg);
}






