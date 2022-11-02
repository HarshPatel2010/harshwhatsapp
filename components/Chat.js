import { Avatar } from '@material-ui/core';
import {useEffect} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth,db } from '../firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, doc, setDoc ,where,query,getDocs} from "firebase/firestore";
import { useRouter } from 'next/router';

const Chat = ({id,users}) => {
  const router = useRouter();
    const [user] = useAuthState(auth);
    const userRefCollection = collection(db,"users");
    const userRef =query(userRefCollection,where("email","==",getRecipientEmail(users,user)));
    const [recipientSnapshot] = useCollection(userRef);
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users,user);

    const enterChat = ()=>{
      router.push(`/chat/${id}`)
    }

  
  return (
    <Container onClick={enterChat}>
        {recipient && recipient ? (<UserAvatar src={recipient?.photo}/>) : (<UserAvatar style={{backgroundColor:"black"}} >{recipientEmail[0]}</UserAvatar>)}
        <p>{recipientEmail}</p>
    </Container>
  )
}

export default Chat;

const Container = styled.div`
display: flex;
align-items: center;
cursor: pointer;
padding: 15px;
word-break: break-all;
:hover{
    background-color: #e9eaeb;
}
`;
const UserAvatar = styled(Avatar)`
margin: 5px;
margin-right:15px;


`;
