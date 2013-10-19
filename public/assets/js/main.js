$(document).ready(function () {
    $('.live-tile').hide();

    var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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

    // $(window).resize(function () {
    //     resizeWindow();
    // });
    // resizeWindow();

    $('#board-video').hide();
    $.getJSON('/videos', function(data){

        // Only load the images if we have no videos
        if ( data.videos.length == 0 || mobile || location.hash == '#mobile') {

            $.getJSON('/images', function(data){
                homepage_images = data.images;
                updateBoardImage();
            });
        }
        else {
            var video = data.videos[1];
            $('#board-video').attr('src', video.source).fadeIn('fast');
            document.getElementById('board-video').play();
        }
    });

    if ( location.hash == '#winning' ) {
        rotateAll();
    }
});

var homepage_images;
var first_homepage = true;

function updateBoardImage(){
    $('#board-image').fadeOut('fast', function(){

        var i = homepage_images.length;
        i = Math.floor((Math.random() * i) );

        if ( first_homepage ) {
            i = 0;
            first_homepage = false;
        }

        $("#board-image").css("background-image", "url(http://bing.com/" + homepage_images[i].url + ")");
        $("#board-image").css("background-repeat", "no-repeat");
        $('#board-image').fadeIn('fast');

        setTimeout("updateBoardImage()", 5*1000);

    });
}

function pauseAll() {
    $('.live-tile').liveTile("pause");
}

function rotateAll() {
    $('.live-tile').liveTile("animate");
    pauseAll();
    return "Cheater";
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

        if ( memory.matched_tiles_count == 0 ) {
            $('#matches').css('opacity', 0.7).fadeIn('fast');
        }

        $("#matches").append("<a style='display: none' target='_blank' href='http://bing.com/" + $(memory.open_tiles[0]).data("url") + "' ><span><span>" + $(memory.open_tiles[0]).data("title") + "</span><img src='" + $(memory.open_tiles[0]).data("imgurl") + "' /></span></a>");
        $("#matches > a").fadeIn("slow");
        memory.matched_tiles_count += 2;
        if (memory.matched_tiles_count === 30) {
            winnerWinner();
        }
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
    $("#board-canvas,#board-image,#board-tiles").css({
        width: width + "px",
        height: height + "px"
    });
    $("#matches").css({
        width: width + "px"
    })
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

function winnerWinner() {
    $(".live-tile").hide();
    fireworks();
}

function fireworks() {
    return "Fireworks";
}

memory = {
    open_tiles_count: 0,
    matched_tiles_count: 0,
    open_tiles:[]
}
