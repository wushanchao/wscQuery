$().extend('input_instant',function (call_func) {
    //TODO:检测当前元素是否为input type=text的框

    //如果是
    var last_value = "";
    myAddEvent(this.elements[0],"keyup",function(){
        var keywords = "";
        keywords = this.value;
        if(keywords == ""){
            return false;
        }
        var timer = setTimeout(function(){
            if(keywords !=last_value){//防止重复调用相同词语
                call_func(keywords);
            }
            last_value = keywords;
        },500);//有时候键盘按得太快，监听事件来不及反应，所以用setTimeout函数来延迟
        
    });

    //如果不是，返回错误信息
});