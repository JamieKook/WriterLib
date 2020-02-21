$(document).ready(function() {
    $("#btnDownload").on("click", function(event){
        console.log("clicked"); 
        $(".feedback").show();  
        }); 
    
    $("#btnSubmit").on("click", function(event){
        event.preventDefault(); 
        const bookId = $(this).data("bookid"); 
        console.log(bookId); 
        const comment = $("textarea").val();
        const data = {comment: comment};  
        console.log(data); 
        $.post(`/api/comments/${bookId}`, data, function(data){
            window.location.href = "/library";
        }); 
    }); 

    $("#btnDelete").on("click", function(event){
        event.preventDefault(); 
        const bookId = $(this).data("bookid"); 
        $.ajax({
            url: `/api/books/${bookId}`,
            method: "DELETE"
        }).then(function(data){
            window.location.href = "/home";
        }); 


    })
}); 