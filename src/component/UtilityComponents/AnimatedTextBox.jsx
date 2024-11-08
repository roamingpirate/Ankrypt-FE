import React, { useState, useEffect, useRef } from 'react';

const AnimatedTextbox = () => {
  const hints = ["Enter your name...", "What's on your mind?", "Type here..."];
  const [hintText, setHintText] = useState('');
  const [index, setIndex] = useState(0);
  const [typingIndex, setTypingIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const typingInterval = useRef(null);

  useEffect(() => {
    // Start the typing animation
    startTypingAnimation();

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(typingInterval.current);
    };
  }, [index]); // Re-run the animation when the index changes

  const startTypingAnimation = () => {
    setTypingIndex(0); // Reset typing index
    clearInterval(typingInterval.current); // Clear any previous interval

    // Set up a new interval to simulate typing
    typingInterval.current = setInterval(() => {
      setTypingIndex((prevIndex) => {
        const currentHint = hints[index];
        if (prevIndex < currentHint.length) {
          return prevIndex + 1;
        } else {
          clearInterval(typingInterval.current);
          setIndex((prevIndex) => (prevIndex + 1) % hints.length);
          return prevIndex;
        }
      });
    }, 500); // Adjust typing speed (100ms per character)
  };

  useEffect(() => {
    setHintText(hints[index].substring(0, typingIndex));
  }, [typingIndex, index]);

  return (
    <input
      type="text"
      className={`w-full px-4 py-2 border rounded-md
      transition-colors duration-300 ease-in-out
      ${isFocused ? 'border-white text-white' : 'border-gray-300 text-gray-500'}
      bg-transparent focus:outline-none`}
      placeholder={hintText}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

export default AnimatedTextbox;
