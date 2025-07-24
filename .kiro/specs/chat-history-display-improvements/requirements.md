# Requirements Document

## Introduction

This feature aims to improve the way previous chats are displayed in the sidebar. Currently, chats are displayed with generic labels like "New chat id: {id}", which doesn't provide users with context about the chat content. The enhancement will display the last message from each chat, truncated to fit the container, with a fade effect as it approaches the right edge, making it easier for users to identify and navigate between their conversations.

## Requirements

### Requirement 1

**User Story:** As a user with multiple chat conversations, I want to see a preview of the last message in each chat in the sidebar, so that I can easily identify and navigate to specific conversations.

#### Acceptance Criteria
1. WHEN viewing the chat sidebar THEN each chat item SHALL display the last message content instead of "New chat id: {id}"
2. WHEN the last message is too long THEN the text SHALL be truncated to fit the container width
3. WHEN a chat has no messages THEN a default placeholder text SHALL be displayed
4. WHEN a chat is selected THEN the visual indication of the selected chat SHALL remain clear and distinct

### Requirement 2

**User Story:** As a user, I want the truncated chat previews to have a fade effect at the end, so that I can visually understand there is more content beyond what's displayed.

#### Acceptance Criteria
1. WHEN a chat preview is truncated THEN the text SHALL fade out gradually as it approaches the right edge
2. WHEN the chat preview fits entirely within the container THEN no fade effect SHALL be applied
3. WHEN viewing in different themes (light/dark) THEN the fade effect SHALL be appropriately visible in both themes

### Requirement 3

**User Story:** As a user, I want the chat sidebar to maintain good performance even with many chats, so that I can navigate my chat history smoothly.

#### Acceptance Criteria
1. WHEN loading the chat sidebar with many chats THEN the rendering performance SHALL remain responsive
2. WHEN new chats are added THEN the sidebar SHALL update efficiently without noticeable lag
3. WHEN the chat list is long THEN scrolling through the list SHALL be smooth