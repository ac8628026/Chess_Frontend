const Alert = ({msg}) => {
  return (
    <div>
      <div className=" text-center  py-1 px-3  rounded-full ">
        <div
          className="p-2 items-center bg-amber-700 text-indigo-100 leading-none rounded-full flex lg:inline-flex"
          role="alert"
        >
          <span className="flex rounded-full bg-amber-800 uppercase px-2 py-1 text-xs font-bold mx-1">
            Message
          </span>
          <span className=" text-lg mr-2 text-left flex-auto">
           {msg}
          </span>
          <svg
            className="fill-current opacity-75 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Alert;
