var commentForm = document.querySelectorAll(".comment-form")
commentForm.forEach(form => form.addEventListener('submit', (e) =>{
    e.preventDefault()
    var index = Array.from(commentForm).indexOf(e.target)
    // console.log(index)
    var contentinput= 'commentcontent' +index
    var postinput = 'postid' +index
    var data = {
        content: document.getElementById(contentinput).value,
        post: document.getElementById(postinput).value
    }

    var classcontainer = 'comment' + index
    var commentContainer = document.getElementById(classcontainer)

    // console.log(data)
    // alert("click")
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/comments/create", true) 
    xhr.setRequestHeader('Content-Type', 'application/json')
    
    xhr.onload = function() {
        if(this.status == 201){
        var res = JSON.parse(xhr.response)
        var output = ''
        output += '<li><div class="comet-avatar"><img src="'+res.avatarurl+'" alt=""></div><div class="we-comment"><div class="coment-head"><h5><a href="time-line.html" title="">'+res.username+'</a></h5></div><p>'+res.comment.content+'</p></div></li>'
        
        commentContainer.insertAdjacentHTML('beforeEnd',output)
        }
    }
    
    xhr.send(JSON.stringify(data))
}))
