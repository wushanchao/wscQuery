$().extend('drag', function (){
    var i=0;
    
    for(i=0;i<this.elements.length;i++)
    {
        drag(this.elements[i]);
    }
    
    //拖拽思路就是，鼠标按下，记录鼠标在物体里面的位置object_position；鼠标移动，物体位置就是鼠标位置减去object_position；鼠标放开，就是清除鼠标按下事件和移动事件
    function drag(oDiv)
    {
        oDiv.onmousedown=function (ev)
        {
            var oEvent=ev||event;//兼容IE和Firefox
            var disX=oEvent.clientX-oDiv.offsetLeft;//获取鼠标位置和物体位置的差，也就是鼠标在物体里面的位置
            var disY=oEvent.clientY-oDiv.offsetTop;
            
            document.onmousemove=function (ev)
            {
                var oEvent=ev||event;
                var screen_left = oEvent.clientX-disX;//物体在页面的位置
                var screen_top = oEvent.clientY-disY;

                var extreme_right = document.documentElement.clientWidth - oDiv.offsetWidth;//页面最右边的位置
                var extreme_bottom = document.documentElement.clientHeight - oDiv.offsetHeight;

                //防止物体水平拖出页面范围
                (screen_left < 0) ? (function(){screen_left = 0;})() : (screen_left > extreme_right) ?
                (function(){screen_left = extreme_right})() : null;
                //防止物体垂直拖出页面范围
                (screen_top < 0) ? (function(){screen_top = 0;})() : (screen_top > extreme_bottom) ?
                (function(){screen_top = extreme_bottom})() : null;

                oDiv.style.left=screen_left+'px';
                oDiv.style.top=screen_top+'px';
            };
            
            document.onmouseup=function ()
            {
                document.onmousemove=null;
                document.onmouseup=null;
            };
            return false;//这个是为了防止Firefox的bug。不加这个，你按了鼠标放开了，还能拖东西
        };
        
    }
});