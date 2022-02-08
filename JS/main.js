(function(){ //funcion para crear el board
    self.Board = function(width,height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    self.Board.prototype = {
        get elements(){
            var elements = this.bars;
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
    }

    self.Bar.prototype = {
        down: function(){

        },
        up: function(){

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
        draw: function(){
            for(var i = this.board.elements.length - 1; i >= 0; i--){
                var el = this.board.elements[i];              
                draw(this.ctx,el);
            };
        }
    }

    function draw(ctx,element){
        if(element !== null && element.hasOwnProperty("kind")){
            switch(element.kind){
                case "rectangulo":
                    ctx.fillRect(element.x,element.y,element.width,element.height);
                    break;
            }
        
        }
    }

})();

window.addEventListener("load",main);

function main(){
    var board = new Board(800,400);
    var bar = new Bar(20,150,40,100,board);
    var bar2 = new Bar(740,150,40,100,board);
    var canvas = document.getElementById('canvas');
    var board_view = new BoardView(canvas,board);
    board_view.draw();
};

