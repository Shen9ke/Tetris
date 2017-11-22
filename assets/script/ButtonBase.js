cc.Class({
    extends: cc.Component,

    properties: {
        FunctionTemp: {
            default: [],
            type: cc.Component.EventHandler,
        },

        //Longthouch: false,
        // Speed: 0.4,
    },


    onLoad: function () {
        var Time = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {

            var scaleTo = new cc.scaleTo(0.1, 1.14);        //按钮缩放
            this.node.runAction(scaleTo);
           
            // console.log ("Speed",this.Speed);
            this.TouchEvent = function (Speed) {
                cc.Component.EventHandler.emitEvents(this.FunctionTemp, Speed);
            };
            this.TouchEvent(0);
            // this.timer=function () {
        
            // }
            //this.schedule(this.timer, 0.01);
            
            this.LongThouch = function () {
               // console.log("Time", Time);
                Time++;
                if(Time==5){
                    this.TouchEvent(0.1);Time = 0;
                };
                
            };
            this.scheduleOnce(function () {
              // cc.log("this.schedule(this.LongThouch, 0.05);");
            this.schedule(this.LongThouch,0.02 );
             }, 0.2);
         
            //cc.log(this.scaleX,this.scaleY);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {

            var scaleTo = new cc.scaleTo(0.1, 1.24);
            this.node.runAction(scaleTo);

            // this.unschedule(this.LongThouch);
            // this.unschedule(this.timer);
            this.unscheduleAllCallbacks();
            //Time=0;

        }, this);

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
