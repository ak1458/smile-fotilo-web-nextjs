'use client';

import React from 'react';

type OpenChatButtonProps = {
  children: React.ReactNode;
  className?: string;
  prompt?: string;
};

export const OpenChatButton = ({ children, className, prompt }: OpenChatButtonProps) => {
  const handleClick = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('echo:open-chat', {
        detail: { message: prompt || '' },
      })
    );
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

