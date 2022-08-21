class Board {
    constructor(id) {
        this.position = {};
        this.boardId = id;
        this.selectedPiece = null;
        var board = this;
        this.dropTarget = null;
        for(let i = 0; i < 8; i++) {
            let row = $("<div class='row'></div>");
            for(let j = 0; j < 8; j++) {
                let square = $(`<div class='square ${((i + j) % 2 == 0 ? "white-square" : "black-square")}' data-coord='${`${String.fromCharCode(i + 1 + 96)}${8 - j}`}'></div>`);
                square.on("click", function(e) {
                    e.stopPropagation();
                    board.movePiece(this);
                });

                square.on("dragover", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log("Dragover");
                    board.dropTarget = this;
                });
                row.append(square);
            }
            $(`#${id}`).append(row);
        }
    }

    selectPiece(piece) {
        $(piece).css("opacity", "0.5");
        this.selectedPiece = piece;
    }

    deselectPiece() {
        $(this.selectedPiece).css("opacity", "1");
        this.selectedPiece = null;
    }

    movePiece(square) {
        console.log(square);
        if(this.selectPiece != null && this.selectedPiece != undefined) {
            square.appendChild(this.selectedPiece);
            this.deselectPiece();
        }
    }

    setPosition(fen, validateFen) {
        if(validateFen) {
            if(!this.validateFen(position)) {
                return;
            }
        }
        let rows = fen.split("/");
        for(let i = 0; i < rows.length; i++) {
            let row = rows[i].split("");
            let j = 0;
            while(j < row.length) {
                let skips = parseInt(row[j]);
                if(isNaN(skips)) {
                    this.position[`${String.fromCharCode(j + 1 + 96)}${8 - i}`] = ((row[j].toUpperCase() == row[j]) ? "w" : "b") + row[j].toUpperCase();
                } else {
                    j += skips;
                }
                j++;
            }
        }
        this.updateBoard();
    }

    updateBoard() {
        var board = this;
        $(`#${this.boardId}`).children().each(function(i, row) {
            $(row).children().each(function(j, square) {
                if(square.dataset.coord in board.position) {
                    if($(square).children().length == 0) {
                        let img = $(`<img id='draggable' src='https://chessmates.com.au/wp-content/uploads/${board.position[square.dataset.coord]}.png'>`);
                        img.on("click", function(e) {
                            e.stopPropagation();
                            console.log("click piece");
                            board.selectPiece(this);
                        });
                        img.on("dragstart", function(e) {
                            board.selectPiece(this);
                            console.log("Drag Start");
                        });

                        img.on("dragend", function(e) {
                            console.log("Drag End");
                            console.log(board.dropTarget);
                            if(board.dropTarget != null || board.dropTarget != undefined) {
                                board.movePiece(board.dropTarget);
                            }
                        });
                        $(square).append(img);
                    }
                } else {
                    $(square).empty();
                }
            });
        });
    }
}

function validateFen(fen) {
    // both kings?
    // adds to 64 squares?
    return true;
}

function PGNToFen() {
    return "";
}