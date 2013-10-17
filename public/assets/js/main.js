$(document).ready(function () {
    updateBoardImage();
    $('.live-tile').hide();

    $('.live-tile').fadeIn('slow');
    $('.live-tile').liveTile({
        click: function ($tile, tileData) {
            $($tile).liveTile("animate");
            pauseAll();
            return false; // or return true; 
        }
    });
    $('.live-tile').liveTile("stop");
    
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
