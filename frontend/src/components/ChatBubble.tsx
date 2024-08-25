import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';

interface ChatBubbleProps {
  id: number;
  username: string;
  userImage: string;
  message: string | React.ReactNode; 
  isUser: boolean;
  onUpdateMessage: (id: number, newMessage: string) => void; 
  onDeleteMessagesFrom: (id: number) => void; 
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ id, username, userImage, message, isUser, onUpdateMessage, onDeleteMessagesFrom }) => {
  // State to track if the message is in edit mode
  const [isEditing, setIsEditing] = useState(false);

  // State to hold the edited message text
  const [editedMessage, setEditedMessage] = useState<string>(message as string || '');

  // Function to toggle the edit mode
  const handleEditClick = () => {
    setIsEditing(!isEditing);  // Toggle edit mode
  };

  // Function to save the edited message
  const handleSave = () => {
    setIsEditing(false);  // Exit edit mode
    onUpdateMessage(id, editedMessage); // Update the message via callback
  };

  // Function to handle the deletion of the message and all subsequent messages
  const handleDelete = async () => {
    try {
      // Make a DELETE request to delete the message and all subsequent messages
      await axios.delete(`http://127.0.0.1:8000/messages/${id}`);

      // Call the callback to remove the message from the frontend state
      onDeleteMessagesFrom(id);
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  };
 

  return (
    <div className="flex gap-2.5 group relative">
      <div
        className={`flex flex-col relative grow shrink-0 px-4 py-3 space-y-2 text-sm w-[350px] ${
            isUser ? 'bg-neutral-100' : ''
          }`}
          style={{
            borderRadius: isUser
              ? '14px 14px 0px 14px'
              : '0px var(--radius-radius-extraLarge, 12px) var(--radius-radius-extraLarge, 12px) var(--radius-radius-extraLarge, 12px)',
            background: '#FFF',
          }}
        >
        <div className="flex gap-3 items-end self-start font-bold leading-loose text-black whitespace-nowrap">
          <img loading="lazy" src={userImage} className="object-contain shrink-0 w-6 rounded-full aspect-square" alt={username} />
          <div>{username}</div>
        </div>
        {/* <div className="leading-6 text-black text-opacity-90 text-left">{message}</div> */}

        {isEditing ? (
          <textarea
            className="leading-6 text-black text-opacity-90 text-left p-2 border border-gray-300 rounded-md"
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
          />
        ) : (
          <div className="leading-6 text-black text-opacity-90 text-left">{message}</div>
        )}

        {isUser && (
          <div id='edit-icon' onClick={handleEditClick} className="flex items-center justify-center object-contain shrink-0 rounded-full aspect-square absolute top-2 right-4 mt-1 mr-1 h-[27px] w-[27px] cursor-pointer edit-icon-bg opacity-0 group-hover:opacity-100">
            {isEditing ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 5.5L1 1M5.5 5.5L10 10M5.5 5.5L10 1M5.5 5.5L1 10" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9.16247 2.6114L11.3886 4.83753M1.74204 10.0318L1 13L3.96817 12.258L12.5655 3.66065C12.8437 3.38234 13 3.00493 13 2.6114C13 2.21787 12.8437 1.84046 12.5655 1.56215L12.4378 1.43452C12.1595 1.1563 11.7821 1 11.3886 1C10.9951 1 10.6177 1.1563 10.3394 1.43452L1.74204 10.0318Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        )}

        {/* Display Save and Cancel buttons when in edit mode */}
        {isEditing && (
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleDelete}
              className="px-5 py-1 text-sm font-normal text-[#F81B1B] bg-white border border-solid border-[#F81B1B] rounded-[10px]"
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-1 text-sm font-normal text-white bg-[#9317F6] rounded-[10px]"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;


