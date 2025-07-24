# Design Document

## Overview

This design implements tarot spread image interpretation functionality using the Vercel AI SDK's vision capabilities. The system will process uploaded images through vision-capable AI models (GPT-4 Vision or Gemini Vision) to identify tarot cards and provide interpretations. The implementation builds upon the existing chat infrastructure and file upload components.

## Architecture

### High-Level Flow
1. User uploads image via FileUpload component
2. Image is converted to base64 and combined with text into CoreMessage with ImagePart
3. Chat API processes CoreMessage using Vercel AI SDK with vision-capable AI model
4. AI SDK automatically handles model-specific formatting and sends to AI provider
5. AI analyzes image, identifies tarot cards, and provides interpretation
6. Response is streamed back to user and saved to chat history with proper multi-part structure

### Component Architecture
```
FileUpload Component -> Chat Component -> Chat API Route
                           |                    |
                           v                    v
                    Chat Store (Database)  AI Model (Vision)
```

## Components and Interfaces

### 1. Enhanced FileUpload Component
**Current State**: Basic file selection functionality exists
**Required Changes**:
- Add image preview functionality
- Implement file type validation (JPEG, PNG, WebP)
- Add file size validation and compression if needed
- Convert selected images to base64 format for AI processing

### 2. Updated Chat Component
**Current State**: Displays uploaded images in chat history
**Required Changes**:
- Enhanced image display with proper sizing
- Better error handling for failed image uploads
- Loading states during image processing

### 3. Enhanced Chat API Route
**Current State**: Processes text messages only
**Required Changes**:
- Add support for processing CoreMessage with ImagePart components
- Handle multi-part messages containing both text and image content
- Implement vision-capable model selection (GPT-4 Vision, Gemini Vision)
- Enhanced error handling for image processing failures
### 4. Updated Chat Store
**Current State**: Saves text messages to database
**Required Changes**:
- Update message schema to support multi-part content structure
- Ensure proper serialization/deserialization of CoreMessage format with ImagePart
- Handle larger message payloads due to base64 image data
- Maintain compatibility with existing text-only messages

## Data Models

### CoreMessage with Image Support
Based on Vercel AI SDK's CoreMessage structure, messages will use the standard message parts approach:

```typescript
import { CoreMessage, ImagePart, TextPart } from 'ai';

// User message with both text and image
interface TarotUserMessage extends CoreUserMessage {
  role: 'user';
  content: Array<TextPart | ImagePart>;
}

// Example message structure
const messageWithImage: TarotUserMessage = {
  role: 'user',
  content: [
    {
      type: 'text',
      text: 'Please interpret this tarot spread for me'
    },
    {
      type: 'image',
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...' // base64 data URL
    }
  ]
};
```

### Database Storage Format
```typescript
interface StoredMessage {
  id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: Array<{
    type: 'text' | 'image';
    text?: string;
    image?: string; // base64 data URL for images
  }>;
  createdAt: Date;
}
```

## Vercel AI SDK Integration

### CoreMessage Architecture Benefits
The design leverages Vercel AI SDK's CoreMessage structure with ImagePart components, providing several advantages:

1. **Standardized Format**: Uses the same message structure across different AI providers (OpenAI, Google)
2. **Automatic Conversion**: SDK handles provider-specific formatting automatically
3. **Type Safety**: Full TypeScript support with proper schemas (coreMessageSchema, coreUserMessageSchema)
4. **Multi-modal Support**: Native support for combining text and images in a single message
5. **Future Compatibility**: Built-in support for additional content types (FilePart, ToolCallPart)

### Message Part Types Used
- **TextPart**: For user's text input and questions about the tarot spread
- **ImagePart**: For uploaded tarot card images with base64 data
- **Future Extensions**: Could support FilePart for PDF tarot guides or ToolCallPart for card database lookups

## Implementation Details

### File Processing Pipeline
1. **File Selection**: User selects image file through FileUpload component
2. **Validation**: Check file type (JPEG, PNG, WebP) and size limits
3. **Conversion**: Convert File object to base64 data URL
4. **Preview**: Display image preview in chat input area
5. **Message Construction**: Create CoreMessage with ImagePart containing base64 data
6. **Submission**: Send multi-part message to AI SDK using standard CoreMessage format

### AI Model Integration
- **Primary Model**: GPT-4 Vision (OpenAI) for detailed tarot card analysis
- **Fallback Model**: Gemini 2.0 Flash (Google) with vision capabilities
- **Input Format**: Use Vercel AI SDK's CoreMessage with ImagePart - the SDK handles model-specific formatting automatically
- **Context**: Enhanced system prompt specifically for tarot image interpretation
- **Advantage**: No manual conversion needed between different AI provider formats

### Enhanced System Prompt for Vision
```
You are a Tarot Reflection AI with vision capabilities. When users upload images of tarot spreads:

1. Carefully examine the image to identify individual tarot cards
2. Note the position and orientation (upright/reversed) of each card
3. Identify the spread pattern if recognizable (Celtic Cross, Three Card, etc.)
4. Provide interpretations based on traditional tarot meanings
5. Explain relationships between cards in the spread
6. Ask reflective questions to help users connect the reading to their situation

If the image is unclear or cards cannot be identified, ask specific questions about what you can see and request clarification.
```
## Error Handling

### File Upload Errors
- **Invalid file type**: Clear error message with supported formats
- **File too large**: Guidance on acceptable file sizes and compression
- **Upload failure**: Retry mechanism with user feedback

### AI Processing Errors
- **Vision model unavailable**: Fallback to text-only interaction with user description
- **Image analysis failure**: Request clearer image or manual card description
- **Rate limiting**: Queue system or user notification about temporary delays

### Storage Errors
- **Database save failure**: Retry mechanism for message persistence
- **Large payload handling**: Compression or external storage for large images

## Testing Strategy

### Unit Tests
- File validation logic (type, size, format)
- Base64 conversion utilities
- CoreMessage construction with ImagePart components
- Message serialization/deserialization with multi-part content
- AI model response parsing
- CoreMessage schema validation

### Integration Tests
- End-to-end file upload flow
- AI model integration with vision capabilities
- Database persistence of messages with attachments
- Error handling scenarios

### User Acceptance Tests
- Upload various tarot spread images
- Verify AI can identify common tarot cards
- Test different spread layouts (Celtic Cross, Three Card, etc.)
- Validate interpretation quality and relevance
- Test error scenarios (blurry images, non-tarot images)

## Performance Considerations

### Image Optimization
- Client-side image compression before upload
- Optimal resolution for AI processing (balance between quality and payload size)
- Lazy loading for chat history with many images

### AI Model Efficiency
- Choose appropriate detail level for vision models
- Implement caching for repeated card identifications
- Rate limiting to prevent API quota exhaustion

### Database Performance
- Consider external storage for large image data
- Efficient serialization of attachment metadata
- Indexing strategies for chat retrieval with attachments

## Security Considerations

### File Upload Security
- Strict file type validation on both client and server
- File size limits to prevent abuse
- Sanitization of file metadata

### Data Privacy
- Secure handling of user-uploaded tarot images
- Compliance with AI provider data usage policies
- Option for users to delete images from chat history

### API Security
- Rate limiting for image processing endpoints
- Authentication verification for file uploads
- Input validation for all attachment data