import * as React from 'react';

interface ChatOptionsProps {
  text: string;
  onOptionClick: (option: string) => void;
}

const ChatOptions: React.FC<ChatOptionsProps> = ({ text, onOptionClick }) => {
  return (
    <button onClick={() => onOptionClick(text)} className="gap-2.5 w-fit cursor-pointer self-stretch px-2 py-1.5 mt-3 text-sm leading-loose rounded-2xl border border-[#9317F6] border-solid bg-white bg-opacity-60 text-[#9317F6] text-opacity-90">
      {text}
    </button>
  );
};

export default ChatOptions;