# Implementation Plan

- [x] 1. Update data interfaces and types
  - Extend the ChatInfo interface to include lastMessage property
  - Update type definitions to support the new chat display format
  - _Requirements: 1.1, 1.3_

- [x] 2. Create helper function for message content extraction
  - Implement getLastMessageContent function to safely extract text from message objects
  - Handle different message formats and edge cases (empty messages, non-text content)
  - Add error handling for malformed message data
  - _Requirements: 1.1, 1.3_

- [x] 3. Update server-side data fetching logic
  - Modify the chat data fetching to include last message content
  - Extract last message from each chat's message history
  - Implement fallback for chats with no messages
  - _Requirements: 1.1, 1.3_

- [x] 4. Update ChatSidebar component with new display format
  - Modify the chat list item rendering to show last message preview
  - Implement text truncation for long messages
  - Add proper styling for chat title and message preview hierarchy
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 5. Implement fade effect for truncated text
  - Add CSS gradient overlay for fade effect at text end
  - Ensure fade effect works in both light and dark themes
  - Make fade effect conditional based on text overflow
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 6. Update chat creation logic for better default names
  - Change default chat name from "New chat id: {id}" to "New conversation"
  - Ensure new chat creation maintains consistency with display format
  - _Requirements: 1.1, 1.3_

- [x] 7. Test and optimize performance
  - Test sidebar rendering with multiple chats
  - Verify smooth scrolling and responsive updates
  - Optimize data fetching to avoid loading unnecessary message data
  - _Requirements: 3.1, 3.2, 3.3_