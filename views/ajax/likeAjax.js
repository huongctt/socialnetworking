var like = document.querySelectorAll(".ti-heart")
like.forEach(form => form.addEventListener('click', (e) =>{
    e.preventDefault()
    var index = Array.from(like).indexOf(e.target)
    console.log(index)
    var postinput = 'postid' +index
    var data = {
        post: document.getElementById(postinput).value
    }
    console.log(data)
    // var classcontainer = 'comment' + index
    // var commentContainer = document.getElementById(classcontainer)

    // console.log(data)
    // alert("click")
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/likes/create", true) 
    xhr.setRequestHeader('Content-Type', 'application/json')
    
    xhr.onload = function() {
        if(this.status == 201){
        var res = JSON.parse(xhr.response)
        alert(res.message)
        }
    }
    
    xhr.send(JSON.stringify(data))
}))