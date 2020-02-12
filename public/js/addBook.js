const bookFile= $("#inputGroupFile01"); 
$(document).ready(function() {
  const bookForm = $("form.addBook");
    $("#btnSubmit").click(function(){
      event.preventDefault();

      var form = $('#fileUploadForm')[0];
      var data = new FormData(form);
      // AJAX request
      $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/upload-bookfile",
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {

            $("#result").text(data);
            console.log("SUCCESS : ", data);
            $("#btnSubmit").prop("disabled", false);

        },
        error: function (e) {

            $("#result").text(e.responseText);
            console.log("ERROR : ", e);
            $("#btnSubmit").prop("disabled", false);

        }
    });
    });
});
    // // Getting references to our form and input
    // const bookForm = $("form.addBook");
    // const titleInput = $("input#bookTitle");
    // const genreInput = $("input#bookGenre");
  
   
    
  
    // // When the signup button is clicked, we validate the email and password are not blank
    // bookForm.on("submit", function(event) {
    //   event.preventDefault();
     
    //   const file =bookFile[0].files[0];
    // //   const reader = new FileReader(); 
    // //   reader.read


    //   const bookData = {
    //     title: titleInput.val().trim(),
    //     genre: genreInput.val().trim(),
    //     file: bookFile[0].files[0] 
    //   };
  

    //   if (!bookData.title|| !bookData.genre|| !bookData.file) {
    //     return;
    //   }
      
    
    //   // addBook(bookData.title, bookData.genre, bookData.file);
    //   titleInput.val("");
    //   genreInput.val("");
    //   bookFile.val(""); 
    // });
  
    // f
    // // Does a post to the signup route. If successful, we are redirected to the members page
    // // Otherwise we log any errors
    // // function addBook(title, genre, file) {
    // //   $.post("/api/books", {
    // //     title: title,
    // //     genre: genre,
    // //     file: file
    // //   })
    // //     .then(function(data) {
    // //     //   authorData.UserId = data.id; 
    // //     //   addAuthorData(authorData); 
    // //       // If there's an error, handle it by throwing up a bootstrap alert
    // //     })
    // //     .catch(handleLoginErr);
    // // }

  