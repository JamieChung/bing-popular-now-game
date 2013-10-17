$(document).ready(function () {
    updateBoardImage();
    $('.live-tile').hide();

    $.getJSON('/popular', function (data) {

        $('.live-tile').fadeIn('slow');
        $('.live-tile').liveTile();

        console.log('this is where we manipulate data');
        console.log(data);
    });
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
