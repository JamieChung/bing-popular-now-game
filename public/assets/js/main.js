$(document).ready(function () {
    updateBoardImage();
    $('.live-tile').hide();

    $('.live-tile').fadeIn('slow');
    $('.live-tile').liveTile({
        click: function ($tile, tileData) {
            if (!$($tile).hasClass("found") && $tile !== memory.open_tiles[0]) {
                tileClick($tile);
            }
            return false;
        }
    });
    $('.live-tile').liveTile("stop");
    
    $(window).resize(function () {
        resizeWindow();
    });
    resizeWindow();
});

function updateBoardImage(){
    $('#board-image').hide();
    $.ajax({ url: "/images", success: 
        function(data, textStatus, jqXHR){
            $("#board-image").css("background-image", "url(http://bing.com/" + data.images[0].url + ")");
            $("#board-image").css("background-repeat", "no-repeat");
            $('#board-image').fadeIn('fast');
        } 
    });
}

function pauseAll() {
    $('.live-tile').liveTile("pause");
}

function tileClick(tile) {    
    if (memory.open_tiles_count < 2) {
        // open tile
        $(tile).liveTile("animate");
        memory.open_tiles_count++;
        memory.open_tiles.push(tile)        
        if (memory.open_tiles_count === 2) {
            setTimeout(checkForMatch, 750);
        }
    }    
    pauseAll();    
}

function checkForMatch() {
    if (memory.open_tiles[0].data("query") === memory.open_tiles[1].data("query")) {
        $(memory.open_tiles[0]).addClass("found").find("div").animate({ opacity: 0 }, 750);
        $(memory.open_tiles[1]).addClass("found").find("div").animate({ opacity: 0 }, 750);
        memory.matched_tiles_count += 2;
    } else {        
        $(memory.open_tiles[0]).effect("shake", { times: 3 }, "slow");
        $(memory.open_tiles[1]).effect("shake", { times: 2 }, "slow");
        $(memory.open_tiles[0]).liveTile("animate");
        $(memory.open_tiles[1]).liveTile("animate");
    }
    pauseAll();
    memory.open_tiles = [];
    memory.open_tiles_count = 0;
}

function resizeWindow() {
    var width = $(window).width() - 250;
    var height = $(window).height() - 150;
    $("#board-image").css({
        width: width + "px",
        height: height + "px"
    });
    if (width + height < 1800) {
        $(".text-match").css("font-size", "20px");
    } else if (width + height > 1800) {
        $(".text-match").css("font-size", "25px");
    }
    $(".live-tile").css({
        width: width*.13 + "px",
        height: height*.18 + "px"
    });
    
}

memory = {
    open_tiles_count: 0,
    matched_tiles_count: 0,
    open_tiles:[] 
}
