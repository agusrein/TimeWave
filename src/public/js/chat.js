
const chatBox = document.getElementById("chatBox");
const socket = io();

chatBox.addEventListener("keyup" , (e)=>{
    if(e.key == "Enter"){
        if(chatBox.value.trim().length > 0){
            socket.emit("message", {user: userName, message: chatBox.value});
            chatBox.value="";
        }
    }
})

socket.on("message", data =>{
    let log = document.getElementById("messagesLogs");
    let messages = "";
    data.forEach( message => {
        messages = messages + `${message.user} dice: ${message.message} <br> <br>`
    });
    log.innerHTML = messages;
})