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
        this.speed_x = 3;
        this.speed_y = 0;
        board.ball = this;
        this.kind = "circulo";
        this.direction = 1;
    }
    self.Ball.prototype = {
        move: function(){
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
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

        play: function(){
            if(this.board.playing){
                this.clean();
                board_view.draw();
                this.board.ball.move();
            }
        }
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

board_view.draw();
window.requestAnimationFrame(controler);

function controler(){
    board_view.play();
    window.requestAnimationFrame(controler);
};

