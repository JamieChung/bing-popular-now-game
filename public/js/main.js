$(document).ready(function(){
  console.log('We are live!');
  updateBoardImage();
  $('.live-tile').liveTile();
});

function updateBoardImage(){
    $.ajax({ url: "/images", success: 
        function(data, textStatus, jqXHR){

            $("#board-image").css("background-image", "url(http://bing.com/" + data.images[0].url + ")");
            $("#board-image").css("background-repeat", "no-repeat");
        } 
    });
}
