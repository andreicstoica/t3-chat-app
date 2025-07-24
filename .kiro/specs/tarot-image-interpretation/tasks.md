# Implementation Plan

- [ ] 1. Enhance FileUpload component with image processing capabilities
  - Add file type validation for image files (JPEG, PNG, WebP)
  - Implement file size validation with user-friendly error messages
  - Create base64 conversion utility for selected images
  - Add image preview functionality in the chat input area
  - _Requirements: 1.1, 1.2, 5.1, 5.2, 5.3, 5.4_

- [ ] 2. Update Chat API route to handle CoreMessage with ImagePart components
  - Modify POST handler to construct CoreMessage with both TextPart and ImagePart
  - Add vision-capable model selection logic (GPT-4 Vision, Gemini Vision)
  - Implement proper CoreMessage formatting using Vercel AI SDK types
  - Update system prompt to include tarot image interpretation instructions
  - Add error handling for image processing and vision model failures
  - _Requirements: 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2_

- [ ] 3. Add comprehensive error handling and user feedback
  - Implement client-side validation with clear error messages
  - Add server-side error handling for various failure scenarios
  - Create user-friendly feedback for processing states
  - Add fallback mechanisms when vision models are unavailable
  - _Requirements: 3.3, 5.4, 5.5_

- [ ] 4. Create utility functions and type definitions for CoreMessage support
  - Import and use CoreMessage, ImagePart, TextPart types from Vercel AI SDK
  - Create file validation utility functions
  - Implement base64 conversion helpers
  - Add CoreMessage construction utilities for multi-part messages
  - Add image optimization utilities if needed
  - _Requirements: 1.1, 1.2, 5.1, 5.2_

- [ ] 5. Update Chat component to display multi-part messages
  - Modify message rendering to handle both TextPart and ImagePart content
  - Implement proper image display with aspect ratio preservation
  - Add loading states for image processing
  - Ensure proper styling and layout for messages with images
  - Add fallback display for failed image loads
  - _Requirements: 4.2, 4.3, 4.5_

- [ ] 6. Update database schema and chat storage for multi-part messages
  - Modify message storage to handle CoreMessage structure with multiple content parts
  - Update serialization/deserialization logic for ImagePart components
  - Ensure backward compatibility with existing text-only messages
  - Add proper indexing for messages with image content
  - _Requirements: 4.1, 4.2, 4.4_

- [ ] 7. Write comprehensive tests for image functionality
  - Create unit tests for file validation and conversion utilities
  - Add tests for CoreMessage construction with ImagePart components
  - Add integration tests for the complete image upload flow
  - Test AI model integration with various image formats using CoreMessage
  - Add error scenario testing for edge cases
  - Test CoreMessage schema validation
  - _Requirements: All requirements validation_