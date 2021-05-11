var container = document.querySelector(".loadMore")
var postForm = document.querySelector("#post-form")
const btn = document.getElementById("btn")
postForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    var data = {
        content: document.getElementById('content').value
    }
    var xhr = new XMLHttpRequest()
    xhr.open("POST", "/posts/create", true) 
    xhr.setRequestHeader('Content-Type', 'application/json')
    
    xhr.onload = function() {
        if(this.status == 201){
        var post = JSON.parse(xhr.response)
        console.log(post.content)   
        var output = ''
        // output += '<li>new post: '+ post.content + '<li>'
        output += '<div class="central-meta item"><div class="user-post"><div class="friend-info"><figure><img src="images/resources/friend-avatar10.jpg" alt=""></figure><div class="friend-name"><ins><a href="/users/'+post.user + '" title="">'+ post.user +'</a></ins></div><div class="post-meta"><div class="we-video-info"><ul><li><span class="comment" data-toggle="tooltip" title="Comments"><i class="fa fa-comments-o"></i><ins>'+ post.comments.length+ '</ins></span></li><li><span class="like" data-toggle="tooltip" title="like"><i class="ti-heart"></i><ins>'+post.likes.length +'</ins></span></li></ul></div><div class="description"><p style="color:black ;font-size:16px !important; ">'+post.content+'</p></div></div></div></div> </div>'
        console.log(output)
        container.insertAdjacentHTML('beforeBegin',output)
        }
    }
    xhr.send(JSON.stringify(data))
})



