import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import ChatOptions from './ChatOptions';
import Actions from './Actions';
import FooterForm from './FooterForm';
import axios from 'axios';
import botImage from '../assets/bot_img.png';
import usrImage from '../assets/usr_img.png'
import profile from '../assets/profile.svg'


// Interface for a message object, representing both user and bot messages.
interface Message {
    id: number; // Unique identifier for each message.
    username: string; // The name of the user or bot sending the message.
    userImage: string;  // URL of the user's or bot's avatar image.
    message: string | React.ReactNode; // The message content, which can be a string or JSX 
    isUser: boolean; // Boolean flag indicating if the message is from the user (true) or the bot (false).
    isTyping?: boolean; // flag to indicate if the message is being typed
    isEditing?: boolean; // flag to indicate if the user is currently editing their message.
  }

const ChatBox: React.FC = () => {

  // Load initial messages from local storage when the component mounts.
  const loadMessagesFromLocalStorage = () => {
    const storedMessages = localStorage.getItem('chatMessages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  };

  // Set up the state to hold messages, initializing it with messages from local storage.
  const [messages, setMessages] = useState<Message[]>(loadMessagesFromLocalStorage());

  // Reference to the chat container, used for scrolling to the bottom of the chat.
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // State to track whether the user is currently scrolling
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  /**
   * First useEffect:
   * - Adds an event listener to track when the user is scrolling the chat container.
   * - Updates the `isUserScrolling` state based on whether the user is at the bottom of the chat.
   * - If the user is not at the bottom, `isUserScrolling` is set to true, indicating that automatic
   *   scrolling should be disabled.
   */
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        // Determine if the user has scrolled to the bottom of the chat container
        const isAtBottom = chatContainerRef.current.scrollTop + chatContainerRef.current.clientHeight >= chatContainerRef.current.scrollHeight;
        // Update the state to reflect whether the user is scrolling away from the bottom
        setIsUserScrolling(!isAtBottom);
      }
    };
    // Add the scroll event listener to the chat container
    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener('scroll', handleScroll);
    }
    // Cleanup function to remove the scroll event listener when the component is unmounted
    return () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  /**
   * Second useEffect:
   * - Automatically scrolls to the bottom of the chat container whenever new messages are added,
   *   but only if the user is not actively scrolling.
   * - This ensures that the chat stays up-to-date with the latest messages unless the user is
   *   intentionally viewing older messages.
   */
  useEffect(() => {
    // Check if the chat container exists and the user is not scrolling
    if (chatContainerRef.current && !isUserScrolling) {
      // Automatically scroll to the bottom of the chat container
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; // Scroll to the bottom of the chat.
    }
  }, [messages, isUserScrolling]); // Effect runs whenever `messages` or `isUserScrolling` changes

  /**
   * Third useEffect:
   * - Similar to the first useEffect, this adds an event listener for scroll events but includes
   *   a timeout to re-enable auto-scrolling after the user has stopped scrolling for 1.5 seconds.
   * - This prevents the chat from snapping to the bottom while the user is scrolling and gives them
   *   time to read older messages.
   */
  useEffect(() => {
    let timeoutId: string | number | NodeJS.Timeout | undefined;
  
    const handleScroll = () => {
      if (chatContainerRef.current) {
        // Check if the user has scrolled to the bottom
        const isAtBottom = chatContainerRef.current.scrollTop + chatContainerRef.current.clientHeight >= chatContainerRef.current.scrollHeight;
        // Update scrolling state based on the user's position in the chat
        setIsUserScrolling(!isAtBottom);
  
        // Clear any existing timeout to prevent conflicts
        clearTimeout(timeoutId);
        if (!isAtBottom) {
          // Set a timeout to re-enable auto-scrolling after 100 seconds of inactivity
          timeoutId = setTimeout(() => setIsUserScrolling(false), 100000); // Wait 100 seconds after user stops scrolling
        }
      }
    };
    
    // Add the scroll event listener to the chat container
    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener('scroll', handleScroll);
    }
    // Cleanup function to remove the scroll event listener and clear the timeout on unmount
    return () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount
  
  
  // Effect hook to save messages to local storage whenever the messages state changes.
  useEffect(() => {
    // Convert messages to a serializable format for local storage.
    const serializableMessages = messages.map(msg => ({
        ...msg,
        message: typeof msg.message === 'string' ? msg.message : '' // Convert JSX to an empty string
    }));
    localStorage.setItem('chatMessages', JSON.stringify(serializableMessages)); // Store messages in local storage.
  }, [messages]); // Run this effect whenever messages change.


  useEffect(() => {
    // Set up an interval to clear local storage every 5 minutes (300,000 milliseconds)
    const intervalId = setInterval(() => {
        localStorage.removeItem('chatMessages');
        setMessages([]); // Optionally clear the state as well
    }, 300000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
    }, []);
  
  // Function to send a message to the backend and receive a response.
  const sendMessageToBackend = async (content: string) => {
    try {
      // Post the user's message content to the backend API.
      const json_response = await axios.post('http://127.0.0.1:8000/messages/', {
        content,
      });
      // Return the response content and message ID from the backend.
      return [json_response.data.response, json_response.data.id];
    } catch (error) {
      // Handle any errors that occur during the request.
      return ["Sorry, I couldn't process your request.", null];
    }
  };

  // Function to send an edited message to the backend and update it.
  const editMessageOnBackend = async (id: number, newContent: string) => {
    try {
        // Make a PUT request to update the message content in the backend.
        const json_response = await axios.put(`http://127.0.0.1:8000/messages/${id}`, {
            new_content: newContent,
        });
        return [json_response.data.response, json_response.data.id]; // Return the updated response and message ID.
    } catch (error) {
        // Handle any errors that occur during the update.
        return ["Sorry, I couldn't process your request.", null];  // Return an error message if the update fails.
    }

};

  // Function to handle sending a new message, including updating the UI and interacting with the backend.
  const handleSendMessage = async (content: string) => {
    // Send the user's message content to the backend.
    const [botResponse, id] = await sendMessageToBackend(content);

    // Create a new message object for the user's message.
    const userMessage: Message = {
      id: id,  // Use the id from the backend
      username: 'You',
      userImage: usrImage,
      message: content,
      isUser: true,
    };

    // Update the messages state to include the new user message.
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Create a typing indicator message to simulate the bot typing.
    const typingMessage: Message = {
        id: id,  // Generate the next id for the typing indicator
        username: 'Ava',
        userImage: botImage,
        message: <TypingIndicator />,  // Use the TypingIndicator component as the message content.
        isUser: false,
        isTyping: true,
    };

     // Add the typing indicator to the messages state.
    setMessages((prevMessages) => [...prevMessages, typingMessage]);

    // Simulate bot typing effect.
    simulateTypingEffect(botResponse, id);
  };

  // Simulate typing effect by gradually revealing the bot's response.
  const simulateTypingEffect = (response: string, id: number) => {
    let currentMessage = '';
    const typingInterval = setInterval(() => {
      if (currentMessage.length < response.length) {
        currentMessage += response[currentMessage.length];
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          // updatedMessages[updatedMessages.length - 1].message = currentMessage;
          // Ensure the array is not empty and the last element exists before updating
          if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1]) {
            updatedMessages[updatedMessages.length - 1].message = currentMessage;
        }
          return updatedMessages;
        });
      } else {
        clearInterval(typingInterval);
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          // updatedMessages[updatedMessages.length - 1].isTyping = false;
          // updatedMessages[updatedMessages.length - 1].message = response;
          // Ensure the array is not empty and the last element exists before updating
          if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1]) {
            updatedMessages[updatedMessages.length - 1].isTyping = false;
            updatedMessages[updatedMessages.length - 1].message = response;
        }
          return updatedMessages;
        });
      }
    }, 5);
  };

  // Function to handle clicking on one of the chat options (quick replies)
  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  // Handles editing and saving a message.
  const handleSaveEdit = async (id: number, newContent: string) => {
    updateMessage(id, newContent);

    // Removes subsequent messages after the edit.
    setMessages(prevMessages => {
      const index = prevMessages.findIndex(msg => msg.id === id);
      return prevMessages.slice(0, index + 1);
    });

    // Adds the typing indicator for the bot's new response.
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: id + 1,
        username: 'Ava',
        userImage: botImage,
        message: <TypingIndicator />,
        isUser: false,
        isTyping: true,
      },
    ]);

    // Gets the updated response from the backend.
    const [editedResponse] = await editMessageOnBackend(id, newContent);
    simulateTypingEffect(editedResponse, id + 1);
  };

  // Update a message's content in the state.
  const updateMessage = (id: number, newContent: string) => {
    setMessages(prevMessages => {
      return prevMessages.map(msg => (msg.id === id ? { ...msg, message: newContent } : msg));
    });
  };

  // Function to remove messages from a specific ID onwards
  const onDeleteMessagesFrom = (id: number) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id < id));  // Keep only the messages before the specified ID.
  };


  // The UI of the ChatBox component.
  return (
    <section className="flex flex-col h-screen">
      <div className="flex flex-col w-full h-full overflow-hidden my-5 items-center justify-center pt-5 rounded-3xl bg-zinc-100 max-w-[480px]">
        <header className="flex px-4 pb-2 w-full justify-between items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="8" viewBox="0 0 26 8" fill="none">
              <path d="M1 1.00003H25" stroke="black" stroke-width="2" stroke-linecap="round"/>
              <path d="M1 7.00003H17" stroke="black" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <button onClick={() => setMessages([])}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 3.00003H5C4.46957 3.00003 3.96086 3.21074 3.58579 3.58582C3.21071 3.96089 3 4.4696 3 5.00003V19C3 19.5305 3.21071 20.0392 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0392 21 19.5305 21 19V12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.3751 2.62504C18.7729 2.22722 19.3125 2.00372 19.8751 2.00372C20.4377 2.00372 20.9773 2.22722 21.3751 2.62504C21.7729 3.02287 21.9964 3.56243 21.9964 4.12504C21.9964 4.68765 21.7729 5.22722 21.3751 5.62504L12.3621 14.639C12.1246 14.8763 11.8313 15.05 11.5091 15.144L8.63609 15.984C8.55005 16.0091 8.45883 16.0106 8.372 15.9884C8.28517 15.9662 8.20592 15.921 8.14254 15.8576C8.07916 15.7942 8.03398 15.715 8.01174 15.6281C7.98949 15.5413 7.991 15.4501 8.01609 15.364L8.85609 12.491C8.95062 12.1691 9.12463 11.8761 9.36209 11.639L18.3751 2.62504Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
        </header>

        <div ref={chatContainerRef} className="flex flex-col flex-grow overflow-y-auto items-center w-full px-4 overflow-hidden hide-scrollbar">
                <img
                loading="lazy"
                src={profile}
                className="object-contain mt-4 rounded-full aspect-square w-[54px]"
                alt="Profile"
                />
                <h1 className="mt-2 text-sm font-bold leading-loose text-black">Hi, I’m Ava</h1>
                <p className="text-sm leading-loose text-neutral-500 text-opacity-90">How can I help you?</p>

                <section className="flex flex-col self-stretch mt-4 mb-4 w-full space-y-4">
                      {/* Always render the welcome message */}
                      <div className="flex items-start w-full gap-1">
                        <ChatBubble
                          id={0}
                          username="Ava"
                          userImage = {botImage}
                          message="Hello.👋 I'm Ava. You can ask me any questions."
                          isUser={false}
                          onUpdateMessage={() => {}}
                          onDeleteMessagesFrom={() => {}}
                        />
                        <Actions />
                      </div>

                      
                      <ChatOptions text="Ola! How are you ?" onOptionClick={handleOptionClick} />
                      <ChatOptions text="Write a beautiful Quote on Life" onOptionClick={handleOptionClick} />
                      <ChatOptions text="What's your opinion on AI ?" onOptionClick={handleOptionClick} />

                      
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex items-start w-full ${msg.isUser ? 'justify-end' : 'justify-start'} gap-1`}
                        >
                          <ChatBubble
                            id={msg.id}
                            username={msg.username}
                            userImage={msg.userImage}
                            message={msg.message}
                            isUser={msg.isUser}
                            onUpdateMessage={handleSaveEdit}
                            onDeleteMessagesFrom={onDeleteMessagesFrom} 
                          />
                          {!msg.isUser && !msg.isTyping && <Actions />}
                        </div>
                      ))}
                </section>
        </div>

        <FooterForm onSendMessage={handleSendMessage} />
      </div>
    </section>
 );
};

// The TypingIndicator component displays an animated typing indicator (three bouncing dots).
const TypingIndicator: React.FC = () => {
  return (
      <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
      </div>
  );
};

export default ChatBox;
