(function(){ //funcion para crear el board
    self.Board = function(width,height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
    }

    self.Board.prototype = {
        get elements(){
            var elements = this.bars.map(function(bar){ return bar;});
            elements.push(this.ball);
            return elements;
        }
    }
})();

(function(){ //funcion de las barras laterales
    self.Bar = function(x,y,width,height,board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangulo";
        this.speed = 15;
    }   

    self.Bar.prototype = {
        down: function(){
            this.y += this.speed;
        },
        up: function(){
            this.y -= this.speed;
        },
        toString: function(){
            return "x: "+ this.x +" y: "+ this.y ;
        }
    }

})();

(function(){
    self.Ball = function(x,y,radius,board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.board = board;
        this.speed_x = 9;
        this.speed_y = 0;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;

        board.ball = this;
        this.kind = "circulo";

    }
    self.Ball.prototype = {
        move: function(){
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },

        get width(){
            return this.radius * 2;
        },

        get height(){
            return this.radius * 2;
        },

        collision: function(bar){
            //Reacciona a las colisiones con una barra que recibe como parametro
            var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;
            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if(this.x > (this.board.width / 2)){
                this.direction = -1;
            }else{
                this.direction = 1;
            }
        }
    }
})();

(function(){ //funcion del board para que se vea
    self.BoardView = function(canvas,board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }
        
    self.BoardView.prototype = {
        clean: function(){
            this.ctx.clearRect(0,0,this.board.width,this.board.height);
        },

        draw: function(){
            for(var i = this.board.elements.length - 1; i >= 0; i--){
                var el = this.board.elements[i];              
                draw(this.ctx,el);
            };
        },

        check_collisions: function(){
            for (var i = this.board.bars.length -1; i >= 0; i--){
                var bar = this.board.bars[i];
                if(hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
            };
        },

        play: function(){
            if(this.board.playing){
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
        }
    }

    function hit(a,b){
        //Revisa si colisiona con b
        var hit = false;
        //Colisiones horizontales
        if(b.x + b.width >= a.x && b.x < a.x + a.width){
            //colisiones verticales
            if(b.y + b.height >= a.y && b.y < a.y + a.height)
                hit = true;
        }
        //Colision de a con b 
        if(b.x <= a.x && b.x + b.width >= a.x + a.height){

            if(b.y <= a.y && b.y + b.height >= a.y + a.height)
                hit = true;
        }
        //Colision de b con a 
        if(a.x <= b.x && a.x + a.width >= b.x + b.width){
            if(a.y <= b.y && a.y + a.height >= b.y + b.height)
            hit = true;
        }
        return hit;    
    }

    function draw(ctx,element){
            switch(element.kind){
                case "rectangulo":
                    ctx.fillRect(element.x,element.y,element.width,element.height);
                    break;
                case "circulo":
                    ctx.beginPath();
                    ctx.arc(element.x,element.y,element.radius,0,7);
                    ctx.fill();
                    ctx.closePath();
                    break;
            }
        
        }
})();

var board = new Board(800,400);
var bar = new Bar(5,150,10,100,board);
var bar2 = new Bar(785,150,10,100,board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas,board);
var ball = new Ball(400,200,5,board);


document.addEventListener("keydown",function(ev){
    
    if(ev.keyCode ==38){
        ev.preventDefault();
        bar.up();
    }else if(ev.keyCode == 40){
        bar.down();
    }else if(ev.keyCode === 87){
        bar2.up();
        //W
    }else if(ev.keyCode === 83){
        bar2.down();
        //S
    }else if(ev.keyCode === 32){
        ev.preventDefault();
        board.playing = !board.playing;
    }
});


window.requestAnimationFrame(controler);
board_view.draw();

function controler(){
    board_view.play();
    window.requestAnimationFrame(controler);
};

