$().extend('input_instant',function (call_func) {
    //TODO:检测当前元素是否为input type=text的框
    var input_flag = false;
    for(var i=0; i<this.elements[0].attributes.length; i++){
        if(this.elements[0].attributes[i].nodeValue == "text"){
            input_flag = true;
            break;
        }
        else{
            input_flag = false;
        }
    }
    if(input_flag == false){
        throw ("获取的元素不是input type=text");
    }

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

});