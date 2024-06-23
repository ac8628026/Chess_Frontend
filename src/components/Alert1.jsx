

const Notification = ({status,onJoinNewRoom}) => {
 
  


    return (
      <div
        className={`max-w-sm h-[180px] w-full  rounded-lg    flex  justify-center bg-amber-200 items-center p-2 m-2 `}
      >
        <div className="flex flex-col  items-center ">
          <div className="text-2xl font-bold  m-2">{status}</div>
          <div className="flex items-center m-1">
            { <button
              className=" text-lg p-2 hover:text-gray-600 rounded-lg m-1"
              onClick={onJoinNewRoom}
            >
              Rematch
            </button>}
           
          </div>
        </div>
      </div>
    );
  };
  
  export default Notification;
  