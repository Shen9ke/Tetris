/*本脚本所有函数总汇：
SatartGame   //开始游戏
//重复新循环
     Repeat
     //复位
   Restart
   //结束
	EndGame
   //创建预览方块
   CreatPreview
   //产生随机形状
  RandomTag











*/



var base = require("base");
cc.Class({
  extends: base,

  properties: {
    // DROOP_HEIGHT : 62.8,  //下落的单位位移
    ox: 283,
    oy: -31,
    GameState: 0,  /*游戏状态标记 :0:未开始 1:正在移动 2：方块静止，消去应该渲染新方块 */
    styles: 0,
    stylesT: 0,
    Direction: 0,
    DirectionTemp: 0,               //用于获取预览的方块类型  
    GameScore: 0,          //成绩
    GameLevel: 0,          //等级
    DropSpeed: 0.7,
    GameScoreLabel: {
      default: null,
      type: cc.Label
    },
    GameLevelLabel: {
      default: null,
      type: cc.Label
    },
  },
  // update: function (dt) {},



  //-------------初始化--------------
  InitGame: function () {

    this.styles = Math.ceil(Math.random() * 6);
    this.Direction = Math.ceil(Math.random() * 3);   //Math.random()：得到一个0到3之间的随机数,用来生成随机方块
    this.DirectionTemp = this.Direction;
    this.stylesT = this.styles;
    this.ShapsRender(this.ox = 188.4, this.oy = 62.8, this.DirectionTemp, this.RandomTag(this.styles), 'Canvas/Game_Canvas');
    cc.log('ox,oy', this.ox, this.oy);
    this.GameState = 1;
    this.stylesT = Math.ceil(Math.random() * 6);
    this.CreatPreview();

    this.AutoDrop();


  },


  //重复新循环
  Repeat: function () {
    this.ShapsRender(this.ox = 188.4, this.oy = 4 * 62.8, this.DirectionTemp, this.RandomTag(this.stylesT), 'Canvas/Game_Canvas');
    this.styles = this.stylesT;
    this.GameState = 1;
    this.stylesT = Math.ceil(Math.random() * 7) - 1;      //0-6

    this.Direction = Math.ceil(Math.random() * 4) - 1;          //0-3
    this.DirectionTemp = this.Direction;
    this.CreatPreview();
    this.C_GameOver();
    this.AutoDrop();


  },

  //---------------开始----------------

  SatartGame: function () {
    if (this.GameState === 0) {
      this.InitGame();
    } else {
      if (cc.game.isPaused() === false) {          //判断是继续或暂停
        cc.game.pause();
      } else {
        cc.game.resume();
      };
    };

  },

  //-----------------------复位-----------------------------

  Restart: function () { cc.game.restart(); },


  //-----------------------结束-----------------------------

  EndGame: function () { cc.game.end(); },

  //--------------------------检查是否结束游戏---------------
  C_GameOver: function () {
    cc.find('Canvas/GameTipsCanvas');
    var ii = this.node.children.length - 1, j = 0;
    for (ii; ii >= 0; ii--) {
      //cc.log('ii', this.node.children[ii].y);
      if ((this.node.children[ii].y + 93) > 0) {
        j++;
        // cc.log('j', j);
        if (j > 5) {
          this.Restart();
          j = 0;
        }

      };
    }; j = 0;
  },



  //创建预览方块
  CreatPreview: function () {                         //创建预览方块
    this.CleanPreview();                         //清一下上一次循环的残留方块
    var GameTipsCanvas = 'Canvas/GameTipsCanvas';      //提示舞台
    this.ShapsRender(0, 0, this.Direction, this.RandomTag(this.stylesT), GameTipsCanvas);

  },

  //产生随机形状
  RandomTag: function (styles) {
    var renderr;
    switch (styles) {
      case 0: return renderr = this.LShape.concat();
      case 1: return renderr = this.TShape.concat();
      case 2: return renderr = this.OShape.concat();
      case 3: return renderr = this.SShape.concat();
      case 4: return renderr = this.ZShape.concat();
      case 5: return renderr = this.IShape.concat();
      case 6: return renderr = this.JShape.concat();
      default: ;
    };
  },



  //清除预览方块
  CleanPreview: function () {
    cc.find('Canvas/GameTipsCanvas');
    var nodes = cc.find('Canvas/GameTipsCanvas');
    // this.node = nodes
    // this.node
    nodes.destroyAllChildren();
  },



  //消行函数					  
  CleanLine: function () {
    var YHight = -1224.6, count = 0, list = 1;                //i为数组位置，j为记录相同x坐标的节点个数，YHight为y坐标
    this.node = cc.find('Canvas/Game_Canvas');
    for (YHight; YHight < 0; YHight = YHight + 62.8, list++) {
      for (var i = 0; (i < this.node.children.length) && count <= 10; i++) {			//循环10次
        var yy = this.node.children[i].y;
        if (Math.abs(yy - YHight) < 5) { count++ };
        if (count == 10) {
          for (var id = this.node.children.length - 1; id >= 0; id--) {
            cc.log("yyid1", id);
            if (Math.abs(this.node.children[id].y - YHight) < 5) {
              this.node.children[id].destroy();
             // cc.log("yyid", id);
             // cc.log("yy", this.node.children[id].y);
            };
          };
          this.GameScore = this.GameScore + 10;
          this.GameScoreLabel.string = this.GameScore;
          this.DropLine(YHight);
          //i = 0;
        };

      };  //end for() 2
      cc.log('第' + list + '行', '个数：' + count);
      count = 0;
    };  //end for() 1
  },




  //消行后下落函数
  DropLine: function (YHight) {
    for (var tt = 0; tt < this.node.children.length; tt++) {
      if (this.node.children[tt].y > YHight + 60) {
        var actionby = cc.moveBy(0.5, 0, -62.8);
       // actionby.easing(cc.easeIn(3.0));        //缓动动作，未测
        this.node.children[tt].runAction(actionby.clone());

      };
    };
  },





  //左边界检查返回true,flase
  L_CheckBoundary: function () {
    var i = this.GetNodeArray(), j = 0;
    for (i, j; j < 4; j++ , i++) {
      if (this.node.children[i].x - 62.9 < 0) {

        return false;
      };

    };
    return true;
  },

  //右边界检查返回true,flase
  R_CheckBoundary: function () {
    var i = this.GetNodeArray(), j = 0;
    for (i, j; j < 4; j++ , i++) {    //650
      if (this.node.children[i].x + 62.9 > 610) {
        return false;
      };

    };
    return true;
  },
  //下边界检查
  D_CheckBoundary: function () {
    var i = this.GetNodeArray(), j = 0;
    for (i, j; j < 4; j++ , i++) {
      if (this.node.children[i].y - 62.8 < -1224.6) {
        return false;
      };

    };

    //cc.log('D_CheckBoundary end');
    return true;
  },

  //旋转边界检查
  T_CheckBoundary: function () {
    if (this.T_Check() == true) {
      var i = this.GetNodeArray(), j = 0;
      for (i, j; j < 4; j++ , i++) {
        if (this.node.children[i].y - 62.8 < -1224.6) {
          return false;
        };

      };
      return true;
    };
  },

  //边界不允许旋转的方块
  T_Check: function () {
    var ct = [[0, -62.8, 0], [0, -62.8, 2], [1, -62.8, 1], [1, 502.4, 3], [3, -62.8, 1], [4, -62.8, 1],
    [4, -62.8, 3], [5, -62.8, 1], [5, 439.6, 1], [5, -62.8, 3], [5, 439.6, 3], [6, 439.6, 0], [6, -62.8, 2]];
    for (var i = 0; i < 7; i++) {
      // cc.log('ct sty', ct[i][0], this.styles);
      // cc.log('ct x', ct[i][1], this.ox);
      // cc.log('ct Direction', ct[i][2], this.Direction);
      // cc.log('this.ox', this.ox);
      if (this.styles == ct[i][0] && Math.abs(this.ox - ct[i][1]) < 1 && this.Direction == ct[i][2]) {
        return false;
      };
    };
    return true;
  },


  //右节点间检查

  R_Check: function () {
    var i = 0, b = 0, c = 0, init = this.GetNodeArray();
    c = init - 1;
    //  var x=this.node.children[];
    for (i, init; i < 4; i++ , init++) {             //遍历四个Base小方块
      b = c;				                //根据y坐标寻找节点

      for (b; b >= 0; b--) {				  //寻找除这是个以外小方块的坐标，然后对比预移动坐标是否重合

        if (Math.abs(this.node.children[b].y - this.node.children[init].y) < 60) {

          if (Math.abs(this.node.children[b].x - (this.node.children[init].x + 62.8)) < 60) {

            //cc.log('false');
            return false;
          };

        };
      };
    };
    // cc.log('true');
    return true;
  },

  L_Check: function () {
    var i = 0, b = 0, c = 0, init = this.GetNodeArray();
    c = init - 1;
    //  var x=this.node.children[];
    for (i, init; i < 4; i++ , init++) {             //遍历四个Base小方块
      b = c;				                //根据y坐标寻找节点

      for (b; b >= 0; b--) {				  //寻找除这是个以外小方块的坐标，然后对比预移动坐标是否重合
        //   cc.log('1',b);	
        if (Math.abs(this.node.children[b].y - this.node.children[init].y) < 60) {
          // cc.log('x1',this.node.children[b].x);
          // cc.log('x2',(this.node.children[init].x+62.8*1000)/1000);     
          if (Math.abs(this.node.children[b].x - (this.node.children[init].x - 62.8)) < 60) {
            //    cc.log('1',b);	
            // cc.log('false');
            return false;
          };

        };
      };
    };
    // cc.log('true');
    return true;
  },


  //与下方节点检测
  DW_Check: function () {
    var i = 0, b = 0, c = 0, init = this.GetNodeArray();
    c = init - 1;
    for (i, init; i < 4; i++ , init++) {             //遍历四个Base小方块
      b = c;                   								//根据x坐标寻找节点
      for (b; b >= 0; b--) {
        // cc.log('DW_Check1',b);				  //寻找除这4个以外小方块的坐标，然后对比预移动坐标是否重合
        if (Math.abs(this.node.children[b].x - this.node.children[init].x) < 60) {
          if (Math.abs(this.node.children[b].y - (this.node.children[init].y - 62.8)) < 60) {
            // cc.log('2', b);
            // cc.log('false');
            return false;
          };
        };
      };
    };
    // cc.log('DW_Check true');
    return true;

  },




  //获取活动方块第一个子节点名称数组,来定位正在活动的方块
  GetNodeArray: function () {
    this.node = cc.find('Canvas/Game_Canvas');
    var namearray = this.node.children.concat();
    // cc.log('array',namearray);
    return namearray.length - 4;
  },



  //按钮动作
  MoveRight: function (Speed) {
    //console.log("Speed", Speed);
    if (this.R_CheckBoundary() == true && this.R_Check() == true) {
      this.node = cc.find('Canvas/Game_Canvas');
      var self = this.node;
      //cc.log(self.children.length);
      var i = this.GetNodeArray(), actionby;
      actionby = cc.moveBy(Speed, 62.8, 0);
      self.children[i].runAction(actionby.clone());        //用clone动作，否则要不断定义动作
      self.children[i + 1].runAction(actionby.clone());
      self.children[i + 2].runAction(actionby.clone());
      self.children[i + 3].runAction(actionby.clone());
      this.ox = (this.ox * 1000 + 62.8 * 1000) / 1000;
      //cc.log('ox,oy', this.ox, this.oy);
      //this.scheduleOnce(function(){this.Drop},0.2);

    };



  },

  MoveLeft: function (Speed) {
    //console.log("Speed", Speed);
    if (this.L_CheckBoundary() == true && this.L_Check() == true) {
      this.node = cc.find('Canvas/Game_Canvas');
      var self = this.node;
      var i = this.GetNodeArray(), actionby;
      actionby = cc.moveBy(Speed, -62.8, 0);
      self.children[i].runAction(actionby.clone());
      self.children[i + 1].runAction(actionby.clone());
      self.children[i + 2].runAction(actionby.clone());
      self.children[i + 3].runAction(actionby.clone());
      this.ox = (this.ox * 1000 - 62.8 * 1000) / 1000;
      //cc.log('ox,oy', this.ox, this.oy);
    };
    //this.scheduleOnce(function(){this.Drop},0.2);
  },

  MoveUp: function () { },

  //自动下落并判断是否要消去并开始下一次循环等
  Drop: function () {//for (this.GameState;this.GameState==1;){

    if (this.D_CheckBoundary() && this.DW_Check()) {
      this.node = cc.find('Canvas/Game_Canvas');
      var self = this.node;
      var i = this.GetNodeArray(), actionby, speed = this.DropSpeed - 0.1;//, UINTI_LENGHT = 62.8;
      actionby = cc.moveBy(this.DropSpeed, 0, -62.8);
      self.children[i].runAction(actionby.clone());
      self.children[i + 1].runAction(actionby.clone());
      self.children[i + 2].runAction(actionby.clone());
      self.children[i + 3].runAction(actionby.clone());

      this.oy = (this.oy * 1000 - 62.8 * 1000) / 1000;
      //cc.log('ox,oy',this.ox,this.oy);
      //  cc.log(this.oy);

    };


  },

  //---------------------重写下落函数--------------
  // Drop: function () {
  //},

  AutoDrop: function () {
    this.callback = function () {
      if (this.D_CheckBoundary() && this.DW_Check()) {
        this.Drop();
        //cc.log('this.Drop();');
      }
      else {


        this.scheduleOnce(function () {
          if (!(this.D_CheckBoundary() && this.DW_Check())) {  //再判断一次
            this.unschedule(this.callback);
            this.CleanLine();
            this.Repeat();
          };
        }
          , 1);
        //cc.log('AutoDrop end');};
      };
    };
    this.schedule(this.callback, this.DropSpeed);


  },


  //方块旋转效果
  ActionBT: function () {
    if (this.T_CheckBoundary() == true) {
      this.node = cc.find('Canvas/Game_Canvas');

      for (var i = this.GetNodeArray(), j = 1; j < 5; i++ , j++) {      //循环四次
        this.node.children[i].destroy();
       // cc.log(cc.isValid(this.node.children[i]));                                //销毁原节点
      };
      this.Direction++;
      if (this.Direction == 4) {
        this.Direction = 0;
      };
      //在原位置创建不同方向方块，形状类型加一（0-3）

      if (this.Direction < 4) {
        cc.log('Direction=', this.Direction);
        this.ShapsRender(this.ox, this.oy, this.Direction, this.RandomTag(this.styles), 'Canvas/Game_Canvas');
        //cc.log('ox,oy', this.ox, this.oy);

      };

    };
  },

  // update: function (dt) {

  // },


});
