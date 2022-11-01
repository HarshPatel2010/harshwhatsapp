import React from 'react';
import {Circle} from "better-react-spinkit";
import styled from 'styled-components';

const Loading = () => {
  return (
    <Center style={{display:"flex",flexDirection:"column",height:"100vh",justifyContent:"center",alignItems:"center"}}>
        <div>
            <img src="static/whatsappLogo.png" alt="Harsh Web Whatsapp Logo" height={200} style={{marginBottom:10}} />
        </div>
        <Circle color="#3CBC28" size={60}/>
    </Center>

  )
}

export default Loading;

const Center = styled.div`

`;