

const Notification = ({status,onJoinNewRoom,onRematch}) => {
 
  


  return (
    <div
      className={`max-w-sm h-[180px] w-full  rounded-lg    flex  justify-center bg-amber-200 items-center p-2 m-2 `}
    >
      <div className="flex flex-col  items-center ">
        <div className="text-2xl font-bold  m-2">{status}</div>
        <div className="flex items-center m-1">
          {onRematch && <button
            className=" text-lg p-2 hover:text-gray-600 rounded-lg m-1"
            onClick={onRematch}
          >
            Rematch
          </button>}
          <button className="text-md font-bold text-white  bg-stone-600 hover:bg-zinc-500 p-2 rounded leading-none m-1" onClick={onJoinNewRoom}>
            Join New Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
