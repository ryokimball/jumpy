(function() {
    /* I've designed an accompanied canvas.html to handle this javascript. It's certainly trivial
     * to make this work in a more dynamic context, but you'll have to figure that out.
     * 
     * BUG [maybe] --my method of adding functions to an array for execution brings the respective
     * function's "this" out of context. E.g. Example, in user.draw(), I could use "this.color" but 
     * now must use "user.color." It kinda makes sense to me but seems like a large drawback,
     * though there's an easy workaround.
     * */
    // debug variable
    var debug = "beginning";
    document.getElementById("debug").innerHTML = "debug";
    //////////  INPUT  ////////////////////////////////////////
    // source: http://stackoverflow.com/questions/5203407/javascript-multiple-keys-pressed-at-once
    var map = []; // array holding all pressed keycodes as "true"
    onkeydown = onkeyup = function(e){
        e = e || event; // to deal with IE
        map[e.keyCode] = e.type == 'keydown';
    }
    //////////  UPDATE  ////////////////////////////////////////
    var update = { // Handling the updates
        array : [], // holds all update functions to be ran 
        add : function(func){ // adds function to array
            this.array.push(func);
        },
        remove : function(func){ // removes function from array
            index = this.array.indexOf(func);
            this.array.splice(index,1);
        },
        run : function(){ // runs functions in array
            for(i = 0; i <= this.array.length - 1; i++){
                this.array[i]();
            }
        }
    }
    //////////  DRAW  ////////////////////////////////////////
    var draw = { // Handling drawing
        array : [], // aholds all update functions to be ran 
        add : function(func){ // adds function to array
            this.array.push(func);
        },
        remove : function(func){ // removes function from array
            index = this.array.indexOf(func);
            this.array.splice(index,1);
        },
        run : function(){ // runs functions in array
            for(i = 0; i <= this.array.length - 1; i++){
                this.array[i]();
            }
        }
    }
    //////////  GAME  ////////////////////////////////////////
    function game() { // This is the loop that runs the game
        update.run();
        draw.run();
        requestAnimationFrame(game); // This is bootstrapped at the end of the script.
    }
    //////////  CANVAS  ////////////////////////////////////////
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    canvas.update = function(){
        canvas.width    = window.innerWidth;
        canvas.height   = window.innerHeight;
    }
    canvas.draw = function(){
        context.fillStyle = '#ccc';
        context.fillRect(0, 0, window.innerWidth, window.innerHeight-40);
        context.strokeStyle = 'black';
        context.lineWidth = '5';
        context.strokeRect(0, 0, window.innerWidth, window.innerHeight-40);
    }
    update.add(canvas.update);
    draw.add(canvas.draw);
    //////////  USER  ////////////////////////////////////////
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
            && (user.canJump)){
                user.canJump = false;
                user.isJumping = true;
                user.isFalling = true; 
                user.downforce = -20;
            }
            // left
            if((map[37])
            && (user.canMoveLeft)){
                user.isMovingLeft = true;
                user.X -= user.speed;
            }else{
                user.isMovingLeft = false;
            }
            // right
            if((map[39])
            && (user.canMoveRight)){
                user.isMovingRight = true;
                user.X += user.speed;
            }else{
                user.isMovingRight = false;
            }
            if(map[40]){ // down
            }
            // external forces
            if(user.isFalling){
                user.downforce += 1;
            }
            user.Y += user.downforce;
        },
        draw    : function(){
            context.fillStyle = user.color;
            context.fillRect(user.X,user.Y,user.width,user.height);
        }
    };
    update.add(user.update);
    draw.add(user.draw);
    //////////  FLOOR  ////////////////////////////////////////
    var floor = {
        Y : (window.innerHeight - 40),
        update : function(){
            if((user.Y + user.height) >= floor.Y){
                user.isFalling  = false;
                user.canJump    = true;
                user.isJumping  = false;
                user.Y = floor.Y - user.height;
                user.downforce = 0;
            }
        }
    }
    update.add(floor.update);
    //////////  LEFT WALL  ////////////////////////////////////////
    var leftWall = {
        X : 0,
        update : function(){
            if(user.X <= leftWall.X){
                user.canMoveLeft = false;
            }else{
                user.canMoveLeft = true;
            }
        }
    }
    update.add(leftWall.update);
    //////////  RIGHT WALL  ////////////////////////////////////////
    var rightWall = {
        X : window.innerWidth,
        update : function(){
            if((user.X + user.width) >= rightWall.X){
                user.canMoveRight = false;
            }else{
                user.canMoveRight = true;
            }
        }
    }
    update.add(rightWall.update);
    //////////  PLATFORM[s]  ////////////////////////////////////////
    function Platform(X,speed,color){
        
        
        if(color == undefined){
            this.color = "#909";
        }else{
            this.color = color;
        }        
        if(speed == undefined){
            this.speed = 5;
        }else{
            this.speed = speed;
        }
        if(X == undefined){
            this.X = window.innerWidth  * Math.random();
            if(this.X + this.width > window.innerWidth){
                this.X -= this.width;
            }
        }else{
            this.X = X;
        }
        this.Y = 0;
        this.width = window.innerWidth / 10;
        this.height = window.innerHeight / 30;
        this.update = function(){
            this.Y -= speed;
        }
        this.draw   = function(obj){
            document.getElementById("debug").innerHTML = this;
            context.fillStyle = this.color;
            context.fillRect(this.X,this.Y,this.width,this.height);
        }
        update.add(this.update);
        draw.add(this.draw);
        
    }
    var Homeboy = new Platform();
    //////////  TEXT  ////////////////////////////////////////
    draw.add(function(){
        context.textAlign = 'center';
        context.font="10px Georgia";
        context.fillStyle = "#000";
        context.fillText(   debug,
                            window.innerWidth/2,
                            window.innerHeight - 20);

    });
    requestAnimationFrame(game);
})();
