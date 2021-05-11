var container = document.querySelector("#posts-list-cointainer")
var postForm = document.querySelector("#post-form")
const btn = document.getElementById("btn")
// btn.addEventListener('click', (e) =>{
//     var data = {
//         content: document.getElementById('content').value
//     }
//     var xhr = new XMLHttpRequest()
//     xhr.open("POST", "/posts/create", true) 
//     xhr.setRequestHeader('Content-Type', 'application/json')
    
//     xhr.onload = function() {
//         if(this.status == 201){
//         var post = JSON.parse(xhr.response)
//         console.log(post.content)   
//         alert(post)
//         var output = ''
//         output += '<p>new post: '+ post.content + '<p>'
//         container.insertAdjacentHTML('beforeend',output)
//         }
//     }
//     xhr.send(JSON.stringify(data))
// })
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
        output += '<li>new post: '+ post.content + '<li>'
        console.log(output)
        container.insertAdjacentHTML('beforeBegin',output)
        }
    }
    xhr.send(JSON.stringify(data))
})


