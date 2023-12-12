import { useState, useEffect } from 'react';
import {messageRequest} from "./api/message"
import { TfiMenuAlt } from "react-icons/tfi";
import { BsChatLeft } from "react-icons/bs";
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [responseMessage, setResponseMessage] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [previousChats, setPreviousChat] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const handleSendMessage = async () => {
    try {
      const message = messageInput.trim();
      if (message === "") return;

      const response = await messageRequest({ coded: message });
      const responseData = response.data;

      if (
        responseData &&
        responseData.choices &&
        responseData.choices.length > 0
      ) {
        const answer = responseData.choices[0].message;
        setResponseMessage(answer);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const createNewChat = () => {
    setResponseMessage(null);
    setMessageInput("");
    setCurrentTitle(null);
  };

  const handleclick = (title) => {
    setCurrentTitle(title);
    setResponseMessage(null);
    setMessageInput("");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if ((!currentTitle && messageInput && responseMessage)) {
      setCurrentTitle(messageInput);
    }
    if ((currentTitle && messageInput && responseMessage)) {
      setPreviousChat(prevChats => (
        [
          ...prevChats,
          {
            title: currentTitle,
            role: "user",
            content: messageInput
          },
          {
            title: currentTitle,
            role: responseMessage.role,
            content: responseMessage.content
          },
        ]
      ));
      setMessageInput("");
    }
  }, [responseMessage, currentTitle]);

  const shouldApplyFilter = sidebarOpen && window.innerWidth <= 640;
  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );

  return (
    <div className="flex mt-[-100px]">
      <section
        className={`absolute flex flex-col justify-between mt-[100px] h-screen w-[244px] p-0 bg-black text-white z-50 transition-all duration-500  
        ${sidebarOpen ? "" : "transform -translate-x-[245px]"}`}
      >
        <span
          className={`absolute mt-2 transition-all duration-500 
          ${sidebarOpen ? "left-[195px]" : "left-[250px]"}`}
        >
          <TfiMenuAlt
            className="flex flex-shrink-0 items-center justify-center  h-11 w-11 p-[14px] rounded-md border text-white  border-white/20 hover:bg-gray-500/10 transition-colors duration-200 cursor-pointer"
            onClick={toggleSidebar}
          />
        </span>

        <div className="flex flex-row mt-2 mr-14 ml-2 gap-2">
          <button
            onClick={createNewChat}
            className="flex flex-shrink-0 flex-grow gap-3 p-3 h-11 items-center  text-[12px] rounded-md border text-white border-white/20 hover:bg-gray-500/10 transition-colors duration-200 cursor-pointer"
          >
            <span className="text-[20px]">+</span> New chat
          </button>
        </div>

        <ul className="text-[12px] p-[10px] mt-[10px] mr-3 h-full">
          {uniqueTitles?.map((title, index) => (
            <li
              onClick={() => handleclick(title)}
              key={index}
              className="flex flex-grow gap-3 p-3 h-11 items-center text-[12px] rounded-md hover:bg-gray-500/10"
            >
              <BsChatLeft /> {title}
            </li>
          ))}
        </ul>

        <nav className="p-[10px] m-[10px] border-t-[0.5px] border-solid">
          <p className='text-[12px]'>Made by Cristian</p>
        </nav>
      </section>

      <section
        className={`main h-screen w-full p-0 flex flex-col justify-between mt-[100px] items-center text-center text-white bg-[#343541] transition-all duration-500 ${
          sidebarOpen ? "sm:ml-[240px] max-sm:brightness-75" : ""
        }`}
        onClick={shouldApplyFilter ? toggleSidebar : undefined}
      >
        {!currentTitle && (
          <h1 className="mt-10 text-[30px] font-[700]">ChatGPT-API</h1>
        )}
        <ul className="overflow-y-auto w-auto p-0">
          {currentChat?.map((chatMessage, index) => (
            <li key={index} className={`flex p-5 my-5 text-[14px] lg:px-[200px] sm:px-[60px] md:px-[130px] text-left flex-col ${chatMessage.role === 'user' ? 'order-2' : 'order-1'}`}>
              <p className="min-w-[100px]">{chatMessage.role}</p>
              <p className="order-3">{chatMessage.content}</p>
            </li>
          ))}
        </ul>

        <div className="bottom-sec w-full flex flex-col justify-center items-center">
          <div className="input-container relative w-[95%] max-w-[650px]">
            <textarea
              className="w-full py-3 px-[15px] max-h-12 border-none rounded-[10px] outline-none shadow-2xl bg-[#202123]"
              id="submit"
              placeholder="Send a Message"
              style={{ resize: "none" }}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <div
              onClick={handleSendMessage}
              className="submit absolute bottom-[15px] right-4  cursor-pointer"
            >
              ➢
            </div>
          </div>
          <p className="info text-[10px] font-[11px] p-[10px]">
            Chat Gpt Mar 14 Version. Free Research Preview. Our goal is to make
            AI systems more natural and safe to interact with. Your feedback
            will help us improve.
          </p>
        </div>
      </section>
    </div>
  )
}

export default App
