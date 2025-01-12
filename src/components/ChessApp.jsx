import { useState, useEffect, useContext } from "react"; // Import React hooks
import { Chessboard } from "react-chessboard"; // Import the chessboard component
import { Chess } from "chess.js"; // Import the Chess library

import { RoomContext } from "../useContext/RoomContext";
import { useSocket } from "./../useContext/SocketContext";
import Notification from "./Notification";
import Alert from "./Alert";
import PromotionDialog from './PromotionDialog'; // Import the promotion dialog

const ChessBoard = () => {
  const socket = useSocket();
  const [game, setGame] = useState(new Chess()); 
  const [playerSide, setPlayerSide] = useState(null); 
  const [message, setMessage] = useState(""); 
  const [currentTurn, setCurrentTurn] = useState("white"); 
  const [status, setStatus] = useState(""); 
  const { roomId,setRoomId } = useContext(RoomContext);
  const [notify, setNotify] = useState("")
  const [chessEnable,setChessEnable] = useState(false)
  const [showPromotion, setShowPromotion] = useState(false); 
  const [promotionSquare, setPromotionSquare] = useState(null); 
  const [sourceSquare, setSourceSquare] = useState(null); 

  useEffect(() => {
    // Event listener for receiving the player's side
    socket.on("playerSide", (side) => {
      setPlayerSide(side);
      setMessage(`Wating for another player to join the room ${roomId}...`);
    });

    // Event listener for starting the game
    socket.on("startGame", () => {
      setMessage("Game has started!");
      setCurrentTurn("white"); // White always starts first in chess
      setChessEnable(true)

    });

    // Event listener for receiving moves from the opponent
    socket.on("move", (move) => {
      const gameCopy = new Chess(game.fen());
      gameCopy.move(move);
      setGame(gameCopy);
      setCurrentTurn(gameCopy.turn() === "w" ? "white" : "black"); // Update the current turn
    });

    // Event listener for general messages
    socket.on("message", (msg) => {
      setMessage(msg);
    });
    socket.on("gameEnd", (status) => {
      setMessage(status);
      setStatus(status);
    });
     socket.on("requestRematch", () => {
      const gameCopy = new Chess();
      setGame(gameCopy);
      setCurrentTurn("white");
      setStatus("");
    });
    socket.on("NewRoom",(msg)=>{
      setNotify(msg);

      setTimeout(() => {
        window.location.reload();
      }, 5000); 
    });
    socket.on("roomfull", (msg) => {
      
      setNotify(msg);
      
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    });


    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      socket.off("playerSide");
      socket.off("startGame");
      socket.off("move");
      socket.off("gameEnd");
      socket.off("message");
      socket.off("requestRematch");
      socket.off("NewRoom");
      socket.off("roomfull");
    };
  }, [game, socket]); // Dependency array ensures this effect runs only when 'game' or 'socket' changes

  // Function to handle piece drops on the board
  const onDrop = (sourceSquare, targetSquare) => {
    if (
      (currentTurn === "white" && playerSide !== "white") ||
      (currentTurn === "black" && playerSide !== "black")
    ) {
      return false; // It's not the player's turn, so don't allow the move
    }

    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Default to promoting to a queen
    });

    if (move === null) return false; // Return false if the move is illegal

    // Check if the move is a promotion
    if (move.flags.includes('p')) {
      setSourceSquare(sourceSquare);
      setPromotionSquare(targetSquare);
      setShowPromotion(true);
      return;
    }

    handleMove(gameCopy, move);
    return true; // Return true to indicate the move was successful
  };

  // Function to handle the promotion
  const handlePromotion = (promotionPiece) => {
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: sourceSquare,
      to: promotionSquare,
      promotion: promotionPiece,
    });

    handleMove(gameCopy, move);
    setShowPromotion(false);
  };

  // Function to handle move logic
  const handleMove = (gameCopy, move) => {
    let endStatus = "";
    if (gameCopy.isCheckmate()) {
      endStatus = `${playerSide} Win! `;
    } else if (gameCopy.isDraw()) {
      endStatus = "Draw!";
    } else if (gameCopy.isStalemate()) {
      endStatus = "Stalemate!";
    } 

    if (endStatus) {
      console.log(endStatus);
      socket.emit("gameEnd", { roomId, status: endStatus }); // Notify both players of the game end status
    }

    // Update the game state and emit the move to the server
    setGame(gameCopy);
    socket.emit("move", { roomId, move }); // Emit the move with the roomId information
    setCurrentTurn(gameCopy.turn() === "w" ? "white" : "black"); // Update the current turn
  };

  // Function to handle rematch request
  const onRematch = () => {
    socket.emit("requestRematch", roomId);
    console.log("Rematch requested");
  };

  // Function to join a new room
  const onJoinNewRoom = () => {
    
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="" ><Alert msg={message}/></div>
      <p className=" m-2 "><span className="bg-amber-700 p-2 rounded "> Current Turn</span> {currentTurn}</p>
      <div className="relative m-2 p-0">
        <div className={status || notify ? "blur-sm" : "" }>
        <Chessboard
          position={game.fen()} // Set the board position to the current game state
          onPieceDrop={onDrop} // Set the drop handler to our custom function
          boardWidth={400} // Set the width of the board
          showPromotionDialog ={true}
          showBoardNotation={true}
          autoPromoteToQueen = {false } // Set the board orientation based on the player's side
          boardOrientation={playerSide === "white" ? "black" : "white"}
          customBoardStyle={{ display : chessEnable ? "block" : "none"}}
          
        /></div>
        {status && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="">
              <Notification status={status} onRematch={onRematch} onJoinNewRoom={onJoinNewRoom} />
            </div>
          </div>
        )}
        {notify && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="">
              <Notification status={notify} onJoinNewRoom={onJoinNewRoom} />
            </div>
          </div>
        )}
        {showPromotion && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="">
           <PromotionDialog 
            isVisible={showPromotion} 
            onSelectPromotion={handlePromotion} 
          />
          </div>
        </div>
          
        )}
      </div>
      
    </div>
  );
};

export default ChessBoard;
