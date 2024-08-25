import * as React from 'react';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize'; // This package helps in auto-resizing the textarea

// Define the type for the props that FooterForm will accept
interface FooterFormProps {
    onSendMessage: (message: string) => void;  // Callback function to send the user's message
  }


const FooterForm: React.FC<FooterFormProps> = ({onSendMessage} ) => {

  // State to manage the input text
  const [input, setInput] = useState('');
  
  // Handle form submission when the user sends a message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (input.trim()) { // Check if the input is not just whitespace
      onSendMessage(input); // Send the message to the parent component
      setInput(''); // Clear the input after sending
    }
  };

  // Handle the Enter key for sending the message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {  // Check if the Enter key is pressed without the Shift key
      e.preventDefault(); // Prevent the default newline behavior
      if (input.trim()) {  // Check if the input is not just whitespace
        onSendMessage(input);  // Send the message to the parent component
        setInput(''); // Clear the input after sending
      }
    }
  };

  return (
    <footer className="flex gap-4 self-stretch px-7 py-6 w-full text-sm text-center bg-white text-zinc-600">
      <form onSubmit={handleSubmit} className="flex flex-auto justify-between items-center px-3.5 py-3 rounded-2xl border border-solid bg-neutral-50 border-neutral-200">
        <div className="flex w-full gap-3.5 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 0C5.97251 0 6.35556 0.383045 6.35556 0.855556L6.35525 4.64444H10.1444C10.617 4.64444 11 5.02749 11 5.5C11 5.97251 10.617 6.35556 10.1444 6.35556L6.35525 6.35525L6.35556 10.1444C6.35556 10.617 5.97251 11 5.5 11C5.02749 11 4.64444 10.617 4.64444 10.1444V6.35525L0.855556 6.35556C0.383045 6.35556 0 5.97251 0 5.5C0 5.02749 0.383045 4.64444 0.855556 4.64444H4.64444V0.855556C4.64444 0.383045 5.02749 0 5.5 0Z" fill="#363736"/>
          </svg>
          <TextareaAutosize
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown} // Handles the 'Enter' key for submission
            className="focus:outline-none w-full resize-none overflow-hidden"
            placeholder="Ask me anything..."
            aria-label="Ask me anything.."
            tabIndex={0}
            minRows={1}
            maxRows={6} // Adjust this value as needed
            style={{ backgroundColor: 'transparent' }}
          />
        </div>
        <button type='submit'>
            <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
                <circle cx="20.5" cy="20.5" r="20.5" fill="#9317F6"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9189 12.161C14.4263 11.9176 15.0157 11.893 15.5407 12.0896L15.6521 12.1351L31.5862 19.1923C32.3387 19.5256 32.6672 20.3811 32.3199 21.1032C32.1853 21.383 31.9611 21.6132 31.6815 21.761L31.5862 21.8072L15.6521 28.8645C14.6489 29.3089 13.4601 28.8886 12.9971 27.9258C12.7594 27.4315 12.7522 26.8655 12.9733 26.3681L13.0242 26.2626L16.0268 20.4998L13.0242 14.737C12.5614 13.8488 12.8833 12.781 13.7377 12.2594L13.828 12.2075L13.9189 12.161ZM29.3758 20.6712L17.8004 21.3884L14.8137 27.1212L29.3758 20.6712ZM14.8137 13.8783L17.8009 19.6109L29.3763 20.3276L14.8137 13.8783Z" fill="white"/>
            </svg>
        </button>
      </form>
    </footer>
  );
};

export default FooterForm;

