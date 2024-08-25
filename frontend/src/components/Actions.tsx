import * as React from 'react';
import { useState } from 'react';

const Actions: React.FC = () => {

  // State to track if the "Dislike" button is active
  const [isDisliked, setIsDisliked] = useState(false);

  // State to track if the "Like" button is active
  const [isLiked, setIsLiked] = useState(false);

  // Function to handle clicks on the "Dislike" button
  const handleDislikeClick = () => {
    // Toggle the "Dislike" state
    setIsDisliked(!isDisliked);

    // If the "Like" button is active, deactivate it
    if (isLiked) setIsLiked(false);
  };

  // Function to handle clicks on the "Like" button
  const handleLikeClick = () => {
    // Toggle the "Like" state
    setIsLiked(!isLiked);

    // If the "Dislike" button is active, deactivate it
    if (isDisliked) setIsDisliked(false);
  };
  
  return (
    <div className="flex gap-1 self-end">
      <div id='dislike' onClick={handleDislikeClick} className={`flex items-center justify-center object-contain shrink-0 rounded-full aspect-square  h-[26px] w-[26px] cursor-pointer ${ isDisliked ? 'bg-[#9317F6]' : 'bg-white bg-opacity-40'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
          <path d="M10.7884 7.41688L8.12177 12.6669C7.59133 12.6669 7.08262 12.4825 6.70755 12.1543C6.33248 11.8261 6.12177 11.381 6.12177 10.9169V8.58354H2.34843C2.15516 8.58546 1.96372 8.55058 1.78738 8.48133C1.61105 8.41208 1.45402 8.31012 1.32719 8.18249C1.20036 8.05487 1.10676 7.90465 1.05287 7.74223C0.998982 7.57981 0.986093 7.40909 1.0151 7.24188L1.9351 1.99188C1.98331 1.71368 2.14481 1.46011 2.38983 1.27787C2.63485 1.09564 2.94688 0.99703 3.26843 1.00021H10.7884M10.7884 7.41688V1.00021M10.7884 7.41688H12.5684C12.9457 7.42272 13.3124 7.30713 13.5987 7.09207C13.8851 6.877 14.0712 6.57743 14.1218 6.25021V2.16688C14.0712 1.83966 13.8851 1.54009 13.5987 1.32502C13.3124 1.10996 12.9457 0.994372 12.5684 1.00021H10.7884" stroke={isDisliked ? 'white' : '#373737'} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <div id='like' onClick={handleLikeClick} className={`flex items-center justify-center object-contain shrink-0 rounded-full aspect-square h-[26px] w-[26px] cursor-pointer ${ isLiked ? 'bg-[#9317F6]' : 'bg-white bg-opacity-40'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4.0459 6.41305L6.46065 1.00233C6.94573 1.00018 7.41178 1.18775 7.75628 1.52379C8.10078 1.85983 8.29551 2.31681 8.29763 2.79419L8.30826 5.19415L11.759 5.17886C11.9357 5.17611 12.111 5.2112 12.2725 5.28172C12.4341 5.35223 12.5782 5.45647 12.6947 5.58722C12.8113 5.71798 12.8976 5.87211 12.9476 6.03895C12.9976 6.20578 13.0102 6.38133 12.9844 6.55343L12.167 11.9571C12.1242 12.2434 11.9777 12.5049 11.7544 12.6933C11.5312 12.8817 11.2463 12.9844 10.9522 12.9825L4.07515 13.0129M4.0459 6.41305L4.07515 13.0129M4.0459 6.41305L2.2169 6.42115C1.89351 6.42258 1.58393 6.55038 1.35626 6.77644C1.12858 7.00249 1.00147 7.30828 1.00288 7.62653L1.02149 11.8265C1.0229 12.1447 1.15272 12.4494 1.38239 12.6734C1.61206 12.8974 1.92276 13.0225 2.24615 13.021L4.07515 13.0129" stroke={isLiked ? 'white' : '#373737'} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default Actions;