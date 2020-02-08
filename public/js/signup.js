$(document).ready(function() {
  // Getting references to our form and input
  const signUpForm = $("form.signup");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");
  const firstName= $("#firstName"); 
  const lastName = $("#lastName"); 
  let isPseudonym = $("#isPseudonym"); 
  let pseudonymEl = $("#pseudonym"); 

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    const userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if(isPseudonym.is(":checked")){
      usePseudonym = true; 
      pseudonym = pseudonymEl.val().trim()
    } else {
      usePseudonym = false; 
      pseudonym = null; 
    }

    const authorData = {
      firstName: firstName.val().trim(),
      lastName: lastName.val().trim(),
      usePseudonym: usePseudonym,
      pseudonym: pseudonym
    }; 

    if (!userData.email || !userData.password || !authorData.firstName || !authorData.lastName) {
      return;
    }
    
    signUpUser(userData.email, userData.password);
    addAuthorData(authorData); 
    emailInput.val("");
    passwordInput.val("");
    firstName.val(""); 
    lastName.val(""); 
    pseudonymEl.val(""); 
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password) {
    $.post("/api/signup", {
      email: email,
      password: password
    })
      .then(function(data) {
        window.location.replace("/home");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function addAuthorData(authorData){
    $.post("/api/authors", authorData)
      .then(function(data){

      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
