var logout = document.querySelector("#logout")

logout.addEventListener("click", (e) => {
    // e.preventDefault()
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/users/logout", true) 
    xhr.send()
})