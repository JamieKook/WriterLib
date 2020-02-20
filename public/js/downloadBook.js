$(document).ready(function() {

    $(".downloadBtn").on("click", function(event){
        event.preventDefault(); 
        const bookId = $(this).data("bookid"); 
        $.ajax({
            url: `/api/books/fileDownload/${bookId}`,
            type: "GET",
        }).then(function(file){
          
        })
    }); 
}); 