(function() {
    // we have canvas
    var canvas = document.getElementById('canvas');
    // we have context
    var context = canvas.getContext('2d');
    // debug variable
    var debug = "";
    ////  TIMER  //////////////////////////////////////////////////
    // Will need to replace these with onFocus/onBlur 
    var timeElapsed = 0;
    setInterval(function () {
        if(document.hasFocus()){
            timeElapsed += 0.01
        }
    }, 10);
    setInterval(function () {
        if(document.hasFocus()){
            new Platform();
        }
    }, 5000);
    ////  INPUT  //////////////////////////////////////////////////
    // source: http://stackoverflow.com/questions/5203407/javascript-multiple-keys-pressed-at-once
    var map = []; // array holding all pressed keycodes as "true"
    onkeydown = onkeyup = function(e){
        e = e || event; // to deal with IE
        map[e.keyCode] = e.type == 'keydown';
    }
    var user = {
        color   : '#000', 
        canJump         : false,
        isJumping       : false,
        isFalling       : true,
        canMoveLeft     : true,
        iSMovingLeft    : false,
        canMoveRight    : true,
        isMovingRight   : false,
        speed   : 5,
        width   : 10,
        height  : 40,
        downforce   : 1,
        X       : window.innerWidth/2,
        Y       : (window.innerHeight - 40)/2,
        update  : function(){
            //// INPUT ////////////
            // jump (space)
            if((map[32])
            && (this.canJump)){
                this.canJump = false;
                this.isJumping = true;
                this.isFalling = true; 
                this.downforce = -20;
            }
            // left
            if((map[37])
            && (this.canMoveLeft)){
                this.isMovingLeft = true;
                this.X -= this.speed;
            }else{
                this.isMovingLeft = false;
            }
            // right
            if((map[39])
            && (this.canMoveRight)){
                this.isMovingRight = true;
                this.X += this.speed;
            }else{
                this.isMovingRight = false;
            }
            if(map[40]){ // down
            }
            // external forces
            if(this.isFalling){
                this.downforce += 1;
            }
            this.Y += this.downforce;
        },
        draw    :  function(){
            context.fillStyle = this.color;
            context.fillRect(this.X,this.Y,this.width,this.height);
        }
    };
    function  Platform(X,Y){
        this.width = window.innerWidth / 10;
        if(X == undefined) X = window.innerWidth  * Math.random() - this.width;
        if(Y == undefined) Y = window.innerHeight * Math.random();
    };
    var floor = {
        Y : (window.innerHeight - 40),
        update : function(){
            if((user.Y + user.height) >= this.Y){
                user.isFalling  = false;
                user.canJump    = true;
                user.isJumping  = false;
                user.Y = this.Y - user.height;
                user.downforce = 0;
            }
        }
    }
    var leftWall = {
        X : 0,
        update : function(){
            if(user.X <= this.X){
                user.canMoveLeft = false;
            }else{
                user.canMoveLeft = true;
            }
        }
    }
    var rightWall = {
        X : window.innerWidth,
        update : function(){
            if((user.X + user.width) >= this.X){
                user.canMoveRight = false;
            }else{
                user.canMoveRight = true;
            }
        }
    }
    // game function. 
    function game() {
        update();
        draw();
        requestAnimationFrame(game);
    }
    requestAnimationFrame(game);
    // update variables as needed
    function update(){
        updateCanvas();
        floor.update();
        leftWall.update();
        rightWall.update();
        user.update();
    }
    // draw all the things!
    function draw(){
        drawCanvas();
        user.draw();
        drawText();
    }
    // the canvas and background
    function updateCanvas(){
        // keeps the canvas the size of the window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    function drawCanvas(){
        context.fillStyle = '#ccc';
        context.fillRect(0, 0, window.innerWidth, window.innerHeight-40);
        context.strokeStyle = 'black';
        context.lineWidth = '5';
        context.strokeRect(0, 0, window.innerWidth, window.innerHeight-40);
    }
    function drawText(){
        context.textAlign = 'center';
        context.font="10px Georgia";
        context.fillStyle = "#000";
        context.fillText(   debug,
                            window.innerWidth/2,
                            window.innerHeight - 20);
    }
})();
