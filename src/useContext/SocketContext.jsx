import { createContext,useContext,useEffect,useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io('wss://1d30-13-51-146-135.ngrok-free.app/',{path:'/socket.io/',transports:['websocket'],});
    setSocket(newSocket);
  
    return () => newSocket.close();
  }, []);
  

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
