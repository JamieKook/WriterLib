$(document).ready(function() {
  // Getting references to our form and input
  const signUpForm = $("form.signup");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");
  const firstName= $("#firstName"); 
  const lastName = $("#lastName"); 
  let isPseudonym = $("#isPseudonym"); 
  let pseudonymEl = $("#pseudonym"); 

  console.log("connected to signup.js"); 
  // When the signup button is clicked, we validate the email and password are not blank
  $("#submitBtn").on("click", function(event) {
    event.preventDefault();
    console.log("testing"); 
    const userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    let pseudonym; 
    let usePseudonym; 
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
    
    signUpUser(userData.email, userData.password, authorData);
    emailInput.val("");
    passwordInput.val("");
    firstName.val(""); 
    lastName.val(""); 
    pseudonymEl.val(""); 
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password, authorData) {
    $.post("/api/signup", {
      email: email,
      password: password
    })
      .then(function(data) {
        authorData.UserId = data.id; 
        addAuthorData(authorData); 
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function addAuthorData(authorData){
    $.post("/api/authors", authorData)
      .then(function(data){
        window.location.replace("/login");
      })
      .catch(handleLoginErr(err));
  }

  function handleLoginErr(err) {
    $("#alert .msg").text("An account already exsists at this email");
    $("#alert").fadeIn(500);
  }
});
