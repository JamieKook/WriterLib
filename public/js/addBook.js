const bookFile= $("#inputGroupFile01"); 
$(document).ready(function() {
    // Getting references to our form and input
    const bookForm = $("form.addBook");
    const titleInput = $("input#bookTitle");
    const genreInput = $("input#bookGenre");
  
   
    
  
    // When the signup button is clicked, we validate the email and password are not blank
    bookForm.on("submit", function(event) {
      event.preventDefault();
     
      const file =bookFile[0].files[0];
    //   const reader = new FileReader(); 
    //   reader.read


      const bookData = {
        title: titleInput.val().trim(),
        genre: genreInput.val().trim(),
        file: bookFile[0].files[0] 
      };
  

      if (!bookData.title|| !bookData.genre|| !bookData.file) {
        return;
      }
      
      addBook(bookData.title, bookData.genre, bookData.file);
      titleInput.val("");
      genreInput.val("");
      bookFile.val(""); 
    });
  
    // Does a post to the signup route. If successful, we are redirected to the members page
    // Otherwise we log any errors
    function addBook(title, genre, file) {
      $.post("/api/books", {
        title: title,
        genre: genre,
        file: file
      })
        .then(function(data) {
        //   authorData.UserId = data.id; 
        //   addAuthorData(authorData); 
          // If there's an error, handle it by throwing up a bootstrap alert
        })
        .catch(handleLoginErr);
    }
  
    function addAuthorData(authorData){
      $.post("/api/authors", authorData)
        .then(function(data){
          window.location.replace("/home");
        })
        .catch(handleLoginErr);
    }
  
    function handleLoginErr(err) {
      $("#alert .msg").text("An account already exsists at this email");
      $("#alert").fadeIn(500);
    }
  });
  