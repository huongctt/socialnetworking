var logout = document.querySelector("#logout")
var commentForm = document.querySelectorAll(".comment-form")

logout.addEventListener("click", (e) => {
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/users/logout", true) 
    
    xhr.send()
})