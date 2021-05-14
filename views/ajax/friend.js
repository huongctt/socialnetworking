var addFriendForm = document.querySelectorAll(".addfriend")
addFriendForm.forEach(form => form.addEventListener('submit', (e) =>{
    e.preventDefault()
    var index = Array.from(addFriendForm).indexOf(e.target)
    var idindex= 'id' + index
    var id = document.getElementById(idindex).value
    console.log(id)

    // alert("click")
    var xhr = new XMLHttpRequest()
    xhr.open("GET", "/send-request?id=" + id, true) 
    xhr.setRequestHeader('Content-Type', 'application/json')
    
    xhr.onload = function() {
        if(this.status == 200){
        var message = JSON.parse(xhr.response)
        alert(message.message)
        }
    }
    
    xhr.send()
}))