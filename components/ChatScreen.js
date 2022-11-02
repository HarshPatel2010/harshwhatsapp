
import styled from "styled-components";
import { useState,useRef } from "react";
import { Avatar, Button, IconButton } from '@material-ui/core';
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, doc, query, getDocs, getDoc, orderBy, setDoc, serverTimestamp, addDoc ,where} from "firebase/firestore";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import Message from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react"



const ChatScreen = ({ chat, messages }) => {
 
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null);


  // db.collection("chats").doc(router.query.id).collection("messages").orderBy("timestamp","asc")
  const chatRef = doc(db, "chats", router.query.id);
  const messagesRefCollection = collection(chatRef, "messages");
  const messageRef = query(messagesRefCollection, orderBy("timestamp", "asc"));
  const [messagesSnapshot] = useCollection(messageRef);
  const [recipientSnapshot] = useCollection(query(collection(db,"users"),where("email","==",getRecipientEmail(chat.users,user))))
  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map(message =>
      (<Message
        key={message.id}
        user={message.data().user}
        message={{ ...message.data(), timestamp: message.data().timestamp?.toDate().getTime() }} />
      ))
    }else{
      return JSON.parse(messages).map(message=>
        (<Message
          key={message.id}
          user={message.user}
          message={message} />
        )
        )
    }
  };
  const sendMessage = (e) => {
    e.preventDefault();

    //update the last seen
    const userRef = doc(db, "users", router.query.id);
    setDoc(userRef, {
      timestamp: serverTimestamp()
    }, { merge: true });

    //add message
    const chatRef = doc(db, "chats", router.query.id);
    addDoc(collection(chatRef, "messages"), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL
    });
    setInput("");
    scrollToBottom();
  };
  const scrollToBottom = ()=>{
    endOfMessagesRef.current.scrollIntoView({
      behavior:"smooth",
      block:"start"
    });
  };

  const recipientEmail = getRecipientEmail(chat.users,user);
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  return (
    <Container>
      <Header>
      {recipient && recipient ? (<Avatar src={recipient?.photo}/>) : (<Avatar style={{backgroundColor:"black"}} >{recipientEmail[0]}</Avatar>)}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {
            recipientSnapshot ? (
              <p>Last active: {" "}
                {recipient?.lastSeen?.toDate() ? (<TimeAgo datetime={recipient?.lastSeen?.toDate()}/>) : "Unavailable"}
              </p>
            ) : <p>Loading last active...</p>
          }
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessages  ref={endOfMessagesRef} />
       
      </MessageContainer>
      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={(e) => { setInput(e.target.value) }} />
        <button disabled={!input} onClick={sendMessage}>Send Message</button>
        <MicIcon />
      </InputContainer>
    </Container>
  )
}

export default ChatScreen;

const Container = styled.div``;
const InputContainer = styled.form`
display:flex;
align-items:center;
position:sticky;
padding:10px;
bottom: 0;
background-color: white;
z-index: 100;

`;
const Input = styled.input`
flex:1;
outline: 0;
border:none;
border-radius: 10px;
margin-left: 10px;
margin-right: 10px;
align-items: center;
padding: 20px;
position:sticky;
background-color: whitesmoke;

`;

const Header = styled.div`
position: sticky;
top:0;
background-color: white;
z-index: 100;
display:flex;
padding:11px;
height: 80px;
align-items: center;
border-bottom: 1px solid whitesmoke;
`;
const HeaderInformation = styled.div`
flex:1;
margin-left:15px;
> h3{
  margin-bottom: 3px;
}
>p{
  font-size: 14px;
  color: gray;
}
`;
const HeaderIcons = styled.div``;
const IconButtons = styled.div``;
const MessageContainer = styled.div`
min-height:90vh;
padding: 30px;
background-color: #e5ded8;
`;
const EndOfMessages = styled.div`
margin-bottom: 50px;
`;

