(()=>{"use strict";const n=document.getElementById("create-room"),e=document.getElementById("enter-room");function o(){window.alert("준비중입니다")}io("http://localhost:3000"),n.onclick=o,e.onclick=o,new class{constructor(){this.iceConfig={iceServers:[{urls:"stun:stun1.l.google.com:19302"}]},this.offerConn=new RTCPeerConnection(this.iceConfig),this.offerConn.onicecandidate=()=>{console.log("New ICE candidate! (offer)"),console.log(JSON.stringify(this.offerConn.localDescription))},this.dataChannel=this.offerConn.createDataChannel("channel"),this.dataChannel.onopen=()=>console.log("open"),this.dataChannel.onclose=()=>console.log("closed"),this.answerConn=new RTCPeerConnection(this.iceConfig),this.answerConn.onicecandidate=()=>{console.log("New ICE candidate! (answer)"),console.log(JSON.stringify(this.answerConn.localDescription))},this.answerConn.ondatachannel=n=>{n.channel.onopen=()=>console.log("open"),n.channel.onclose=()=>console.log("closed")}}createOffer(){this.offerConn.createOffer().then((n=>this.offerConn.setLocalDescription(n)))}createAnswer(n){this.answerConn.setRemoteDescription(n).then((()=>console.log("done"))),this.answerConn.createAnswer().then((n=>this.answerConn.setLocalDescription(n)))}receiveAnswer(n){this.offerConn.setRemoteDescription(n).then((()=>console.log("done")))}}})();