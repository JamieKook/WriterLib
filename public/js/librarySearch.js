
console.log("connected"); 
$(document).ready(function() {
    let isHidden= true; 
    $(".searchQuestion").on("click", function(){
        if (isHidden){
            $(".searchOptions").show(); 
            isHidden=false; 
        } else {
            $(".searchOptions").hide(); 
            isHidden=true; 
        } 
    })

    function makeBookCards(data){
        $(".bookgall").empty(); 
        for (const book of data){
            let includeBook = false; 
            function prepString(str){
                let lowerStr= str.toLowerCase();
                const searchStr = $("#search").val().trim(); 
                let lowerSearchStr = searchStr.toLowerCase(); 
                 return lowerStr.includes(lowerSearchStr); 
            }; 
            const searchBy = $("#searchBy").val(); 
            switch (searchBy){
                case "Title": 
                    if (prepString(book.title)){
                        includeBook= true; 
                    }
                    break; 
                case "Author Name": 
                    if (prepString(book.authorName)){
                        includeBook= true; 
                    }
                    break; 
                case "Keyword": 
                    if (prepString(book.keywords)){
                        includeBook= true; 
                    }
                    break; 
                case "All Submissions":
                    includeBook =true; 
            }
           
            if (includeBook){
                const bookHtml = `<div class="card text-center" data-keywords="${book.keywords}">
                <img src="${book.imageURL}" height="200" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <div class="card-text">
                        <h6>By ${book.authorName}</h6>
                        <p>Genre: ${book.genre}</p>
                        <p>Type:  ${book.type}</p>
                    </div>
                </div>
                <div class="card-footer">
                    <button><a href="/book/${book.id}">View book</a></button>
                </div>
            </div>` 
                $(".bookgall").append(bookHtml); 
            }
            
        }
    }

    $("#searchForm").on("submit", function(event){
        event.preventDefault(); 
        console.log("searched"); 
        const genre = $("#filterGenre").val(); 
        const type = $("#filterType").val(); 
       
        if (genre !=="All" && type !== "All"){
            $.get(`/api/both/${genre}-${type}`)
            .then(function(data){
                makeBookCards(data); 
            });
        } else if(genre !== "All"){
            $.get(`/api/genre/${genre}`)
            .then(function(data){
                makeBookCards(data); 
            });
        } else if (type !== "All"){
            $.get(`/api/type/${type}`)
            .then(function(data){
                makeBookCards(data);  
            });
        } else if (type === "All" && genre === "All"){
            $.get(`/api/books`)
            .then(function(data){
                makeBookCards(data);  
            });
        }

    })
});