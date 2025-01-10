// Home.js
import { useContext, useState} from "react";
import { RoomContext } from "../useContext/RoomContext";
import VideoChat from "../components/VideoChat";
import ChessApp from "../components/ChessApp";
import { useSocket } from "../useContext/SocketContext";


const Home = () => {
  const socket = useSocket();
  const { roomId, setRoomId } = useContext(RoomContext);
  const [roomTrue, setRoomTrue] = useState(false);

  
  

  const joinRoom = () => {
    socket.emit("join-room", roomId);
    setRoomTrue(true);
  };

  // useEffect(() => {
  //   socket.on("roomjoin", (message) => {
  //     console.log(message);
  //   }
  //   );
  //   return () => {
  //     socket.off("roomjoin");
  //   }
  // }, [socket]);

  const joinNewroom = () => {
    window.location.reload();
    
  }
    

  return (
    <>
      {roomTrue && roomId ? (
        <>
        <div className="flex flex-col items-center">
        <button className="w-full max-w-[50%]  bg-amber-800 rounded-full p-2 m-2 hover:bg-amber-700 " onClick={joinNewroom} >Join New Room</button>
         <div className="flex flex-col md:flex-row justify-between m-4 p-3">
          
         <ChessApp />
         <VideoChat />
         </div>
         </div>
        </>
      ) : ( <div className="flex m-3 justify-center items-center h-auto ">
          <input
           className="border rounded-lg p-2 m-2 w-1/2 md:w-1/4"
            type="text"
            value={roomId}
            name="roomId"
            placeholder="Enter room"
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
          />
          {/* <Notification/> */}
          <button className=" text-white bg-amber-950 p-2.5 rounded-lg hover:bg-amber-800 " onClick={joinRoom}>
            Join Room
          </button>
        </div>
      )}
       
    </>
  );
};

export default Home;
