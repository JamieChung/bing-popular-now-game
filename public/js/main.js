$(document).ready(function(){
  console.log('We are live!');
  updateBoardImage()
});

function updateBoardImage(){
    $.ajax({ url: "/images", success: 
        function(data, textStatus, jqXHR){
            $("#board-image").attr("src","http://bing.com/" + data.images[0].url);
        } 
    });
}