
$(document).ready(function() {
  // const bookFile= $("#inputGroupFile01"); 
  // const bookForm = $("form.addBook");
    $("#btnSubmit").click(function(){
      event.preventDefault();

      var form = $('#fileUploadForm')[0];
      var data = new FormData(form);
      const bookId= $(this).data("bookid"); 
       
      // AJAX request
      $.ajax({
        type: "PUT",
        enctype: 'multipart/form-data',
        url: `/api/books/${bookId}`,
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {

            $("#result").text(data);
            console.log("SUCCESS : ", data);
            $("#btnSubmit").prop("disabled", false);
            window.location.href = `/personalBooks/${bookId}`;

        },
        error: function (e) {

            $("#result").text(e.responseText);
            console.log("ERROR : ", e);
            $("#btnSubmit").prop("disabled", false);

        }
    });
    });
});
  