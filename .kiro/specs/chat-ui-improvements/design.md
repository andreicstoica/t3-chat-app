# Design Document

## Overview

This design document outlines the approach for improving the chat UI in the tarot reading application. The improvements focus on three key areas:

1. Ensuring the chat window takes up the full width of its container
2. Implementing auto-scrolling functionality for new messages
3. Ensuring theme consistency across the chat interface

The changes will be implemented within the existing React component structure, focusing on the `Chat.tsx` component and its interaction with the `ScrollArea` component.

## Architecture

The application follows a Next.js App Router architecture with React components. The chat functionality is built using the AI SDK's `useChat` hook, which manages the chat state and interactions with the AI backend.

The current component hierarchy for the chat interface is:

```
ChatPageContainer
└── ChatSidebar
└── Chat
    └── ScrollArea (for messages)
    └── Input form
```

## Components and Interfaces

### Chat Component

The `Chat` component is the main component that needs modification. It currently has:

1. A container div with width constraints
2. A `ScrollArea` component with width constraints
3. An existing `messagesEndRef` and `useEffect` for scrolling that needs enhancement

### ScrollArea Component

The `ScrollArea` component is a wrapper around Radix UI's ScrollArea primitive. It provides scrolling functionality but needs proper configuration to work with the auto-scroll feature.

## Proposed Changes

### 1. Full Width Layout

The current layout has width constraints that prevent the chat window from utilizing the full available space:

```tsx
// Current implementation
<div className="flex h-full max-h-[calc(100%-160px)] w-full flex-col border-2 border-blue-500 p-4">
  {/* ... */}
  <ScrollArea className="mx-auto h-full w-full max-w-lg flex-1 border-2 border-green-500">
    {/* ... */}
  </ScrollArea>
</div>
```

The `max-w-lg` class on the `ScrollArea` is limiting the width. We'll remove this constraint and adjust the layout to ensure the chat window takes up the full width of its container:

```tsx
// Proposed implementation
<div className="flex h-full max-h-[calc(100%-160px)] w-full flex-col p-4">
  {/* ... */}
  <ScrollArea className="h-full w-full flex-1">
    {/* ... */}
  </ScrollArea>
</div>
```

### 2. Auto-Scrolling Functionality

The current implementation has a basic auto-scroll mechanism:

```tsx
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);
```

This needs enhancement to:
1. Handle streaming messages properly
2. Detect when a user has manually scrolled up
3. Re-enable auto-scrolling when the user scrolls back to the bottom

The proposed implementation will:

```tsx
// Track if user has manually scrolled up
const [userHasScrolled, setUserHasScrolled] = useState(false);
const scrollAreaRef = useRef<HTMLDivElement>(null);

// Handle scroll events to detect manual scrolling
const handleScroll = () => {
  if (!scrollAreaRef.current) return;
  
  const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
  const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
  
  if (isAtBottom) {
    setUserHasScrolled(false);
  } else if (!userHasScrolled && !isAtBottom) {
    setUserHasScrolled(true);
  }
};

// Enhanced auto-scroll logic
useEffect(() => {
  if (!userHasScrolled && messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages, userHasScrolled]);
```

### 3. Theme Consistency

To ensure theme consistency, we'll:

1. Review and update all color references in the Chat component
2. Replace hardcoded colors with Tailwind theme variables
3. Ensure proper dark mode support

For example:

```tsx
// Current implementation with hardcoded colors
<Card
  className={clsx(
    message.role === "user" && "bg-slate-200 dark:bg-slate-800",
    "mb-2 w-full",
  )}
>
  {/* ... */}
</Card>

// Proposed implementation using theme variables
<Card
  className={clsx(
    message.role === "user" && "bg-muted",
    "mb-2 w-full",
  )}
>
  {/* ... */}
</Card>
```

## Data Models

No changes to data models are required for this feature.

## Error Handling

The auto-scroll functionality will include error handling to prevent issues if the scroll container is not available:

```tsx
const handleScroll = () => {
  if (!scrollAreaRef.current) return;
  // ...
};
```

## Testing Strategy

1. **Manual Testing**:
   - Test the chat interface on different screen sizes
   - Verify that the chat window takes up the full width of its container
   - Test auto-scrolling with streaming messages
   - Test manual scrolling up and re-enabling auto-scroll
   - Test theme consistency in both light and dark modes

2. **Component Testing**:
   - Test the `Chat` component with different message scenarios
   - Test the auto-scroll behavior with simulated user interactions

## Implementation Considerations

1. **Performance**: The scroll event listener should be debounced to prevent performance issues
2. **Accessibility**: Ensure the auto-scroll behavior doesn't interfere with screen readers
3. **Mobile Support**: Test the changes on mobile devices to ensure proper responsiveness