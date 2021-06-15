const socket = io()

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput =$messageForm.querySelector('textarea')
const $messageFormButton = $messageForm.querySelector('button')
// const $messages = document.querySelector('#messages')

//template
const $messages = document.querySelector('#message-template')
//option
const sendid = document.querySelector('#sendid').value
const commonChat = document.querySelector('#commonChat').value
// emit from the server
socket.on('message', (message) => {
    console.log( message)
    if (message.creator.toString() == sendid){
        const html = '<li class="me"><p>' +message.content +'</p></li>'
        $messages.insertAdjacentHTML('beforeend',html)
    } else {
        const html = '<li class="you"><p>' +message.content +'</p></li>'
        $messages.insertAdjacentHTML('beforeend',html)
    }
    
})


$messageForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    const message = document.querySelector('textarea').value
    // const commonChat = document.querySelector('#commonChat').value
    // const sendid = document.querySelector('#sendid').value
    const receiveid = document.querySelector('#receiveid').value
    const send = {
        message, commonChat, sendid, receiveid
    }
    // console.log(send)
    // const message = e.target.elements.message.value
    // emit from client to server
    socket.emit('sendMessage', send, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        //enable

        if (error) {
            return console.log(error)
        }
        console.log('The message was delivered!')
    })
})
socket.emit('join', commonChat , (error) => {
    console.log('join error')
})
