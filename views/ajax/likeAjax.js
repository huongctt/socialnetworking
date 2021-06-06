var like = document.querySelectorAll(".ti-heart")
like.forEach(form => form.addEventListener('click', (e) =>{
    e.preventDefault()
    var index = Array.from(like).indexOf(e.target)
    console.log(index)
    var postinput = 'postid' +index
    var data = {
        post: document.getElementById(postinput).value
    }
    // console.log(data)
    var classcontainer = 'like' + index
    var likeContainer = document.getElementById(classcontainer)

    // console.log(data)
    // alert("click")
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/likes/create", true) 
    xhr.setRequestHeader('Content-Type', 'application/json')
    
    xhr.onload = function() {
        if(this.status == 201){
            var res = JSON.parse(xhr.response)
            if (res.message == "Like successfully"){
                var output = ''
                output += '<li><span class="dislike" data-toggle="tooltip" title="liked"><i class="ti-heart-broken"></i></span></li>'
                likeContainer.insertAdjacentHTML('beforeEnd',output)
            } else {
                alert(res.message)
            }
        }
    }
    
    xhr.send(JSON.stringify(data))
}))