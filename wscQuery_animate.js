$().extend('animate', function (json){
    var i=0;
    
    for(i=0;i<this.elements.length;i++)
    {
        startMove(this.elements[i], json);
    }
    
    
    function startMove(obj, json, fn)
    {
        clearInterval(obj.timer);//物体运动时，防止用户多次调用计时器，造成运动混乱
        obj.timer=setInterval(function (){
            var bStop=true;     //这一次运动就结束了——所有的值都到达了
            for(var attr in json)
            {
                //1.取当前的值
                var iCur=0;
                
                if(attr=='opacity')
                {
                    iCur=parseInt(parseFloat(getStyle(obj, attr))*100);//因为opacity属性百分制。要用到parseFloat,parseInt是为了小数运算，出现细小bug
                }
                else
                {
                    iCur=parseInt(getStyle(obj, attr));
                }
                
                //2.算速度
                var iSpeed=(json[attr]-iCur)/8;//采用缓冲运动
                iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);//解决到达终点前，却提前停止运动的计算bug
                
                //3.检测停止
                if(iCur!=json[attr])
                {
                    bStop=false;
                }
                
                if(attr=='opacity')
                {
                    obj.style.filter='alpha(opacity:'+(iCur+iSpeed)+')';
                    obj.style.opacity=(iCur+iSpeed)/100;
                }
                else
                {
                    obj.style[attr]=iCur+iSpeed+'px';
                }
            }
            
            if(bStop)
            {
                clearInterval(obj.timer);
                
                if(fn)//运动结束后的事件
                {
                    fn();
                }
            }
        }, 30)
    }
});