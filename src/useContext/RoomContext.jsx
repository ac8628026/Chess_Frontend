import {  createContext, useState } from "react";

const RoomContext = createContext(null);

const RoomProvider = ({children})=>{
   const [roomId, setRoomId] = useState('')
   

   return(
    <RoomContext.Provider value = {{roomId,setRoomId}}>
        {children}
    </RoomContext.Provider>
   )
}


export {RoomContext,RoomProvider}
