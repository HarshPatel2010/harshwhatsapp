import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { collection, doc,query, getDocs,getDoc, orderBy } from "firebase/firestore";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";



const Chat = ({ messages,chat }) => {
    const router = useRouter();
    const [user]=useAuthState(auth)
    const { query } = router.query;
    return (
        <Container>
            <Head>
                <title>chat with {getRecipientEmail(chat.users,user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages = {messages} />
            </ChatContainer>
        </Container>
    )
}

export default Chat;
export async function getServerSideProps(context) {

    const ref = doc(db, "chats", context.query.id);
    const refMessages = collection(ref, "messages");
    const messagesRes = await getDocs(query(refMessages, orderBy("timestamp", "asc")));
    const messages = messagesRes.docs.map((doc) => {
      return  {
           id: doc.id,
            ...doc.data(),
        }
    }).map(messages => ({ ...messages, timestamp: messages.timestamp.toDate().getTime() }));

    //prepare chats

    // try {
    //     const docSnap = await getDoc(ref);
    //     // console.log(docSnap.data());
    // } catch(error) {
    //     // console.log(error)
    // }

    const chatRes = await getDoc(ref)
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }
//for debugging chat and messages
//    console.log(chat,messages)


    return {
        props: {
            messages: JSON.stringify(messages),
           chat:chat

        }, // will be passed to the page component as props
    }
}

const Container = styled.div`
display: flex;
`;
const ChatContainer = styled.div`
flex:1;
height:100vh;
overflow: scroll;
::-webkit-scrollbar{
    display: none;
}
-ms-overflow-style: none;
scrollbar-width: none;

`;
