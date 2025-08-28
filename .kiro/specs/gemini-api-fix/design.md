# Design Document

## Overview

The current Gemini API integration fails because it uses the older `@google/generative-ai` library which has limitations with image generation and response schemas. This design addresses the issue by migrating to the newer `@google/genai` library, which provides better support for image generation workflows and resolves the "Unsupported response mime type when response schema is set" error.

## Architecture

The fix involves migrating the `generateImages` function in `App.tsx` to:

1. **Update Dependencies**: Replace `@google/generative-ai` with `@google/genai` library
2. **Update Import Statements**: Change imports to use the new library's API
3. **Modify API Client Initialization**: Use the new library's client initialization patterns
4. **Update Response Handling**: Adapt to the new library's response format and methods

## Components and Interfaces

### Modified Components

#### App.tsx - generateImages Function

- **Current Issue**: Uses `responseSchema` with image generation modalities
- **Solution**: Remove schema, parse response manually
- **Impact**: Maintains all existing functionality while fixing the API error

#### Response Processing Logic

- **Input**: Raw Gemini API response without schema constraints
- **Processing**: Manual extraction of image data and text from response parts
- **Output**: Same data structure as before (base64 image data, description text)

### API Integration Changes

#### Before (Problematic)

```typescript
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-image-preview",
  generationConfig: {
    responseModalities: ["Text", "Image"],
    responseSchema: schema, // ← This causes the error
  }
});
```

#### After (Fixed)

```typescript
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-image-preview",
  generationConfig: {
    responseModalities: ["Text", "Image"],
    // No responseSchema - let the API return natural response
  }
});
```

## Data Models

### Response Structure (Without Schema)

The API will return a natural response structure that we'll parse manually:

```typescript
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        inlineData?: {
          mimeType: string;
          data: string; // base64 image data
        };
        text?: string; // description or other text
      }>;
      role: string;
    };
    finishReason: string;
    index: number;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    totalTokenCount: number;
  };
}
```

### Response Processing Flow

1. **Extract Candidates**: Get the first candidate from the response
2. **Process Parts**: Iterate through content parts
3. **Handle Image Data**: Extract base64 data from `inlineData` parts
4. **Handle Text Data**: Extract description from `text` parts
5. **Validate Results**: Ensure at least one image was generated

## Error Handling

### Error Categories

1. **API Configuration Errors**: Invalid API key, model not found
2. **Response Format Errors**: Unexpected response structure
3. **Image Generation Failures**: No image data in response
4. **Network Errors**: Connection issues, timeouts

### Error Recovery Strategy

- **Retry Logic**: Maintain existing 3-retry mechanism
- **Graceful Degradation**: Show meaningful error messages
- **Logging**: Preserve detailed error logging for debugging
- **User Feedback**: Clear error messages in Japanese for user interface

## Testing Strategy

### Unit Tests

- **Response Parsing**: Test manual parsing of various response formats
- **Error Handling**: Test error scenarios and retry logic
- **Data Extraction**: Verify correct extraction of image and text data

### Integration Tests

- **API Calls**: Test actual API calls with valid/invalid configurations
- **End-to-End**: Test complete image generation workflow
- **Error Scenarios**: Test network failures, invalid responses

### Manual Testing

- **UI Functionality**: Verify all existing features work after the fix
- **Image Generation**: Test various prompts and image inputs
- **Error Display**: Verify error messages display correctly

## Implementation Considerations

### Backward Compatibility

- **UI Components**: No changes to existing UI components
- **State Management**: Maintain existing state structure
- **User Experience**: Preserve all existing functionality

### Performance Impact

- **Response Processing**: Manual parsing may be slightly slower than schema validation
- **Memory Usage**: No significant change in memory usage
- **API Calls**: Same number and frequency of API calls

### Security Considerations

- **API Key Handling**: No changes to existing secure API key storage
- **Input Validation**: Maintain existing input validation
- **Response Validation**: Add manual validation for response structure

## Migration Path

### Phase 1: Remove Schema Constraint

1. Remove `responseSchema` from model configuration
2. Update response processing to handle natural API responses
3. Test basic image generation functionality

### Phase 2: Enhance Error Handling

1. Improve error messages for new response format
2. Add validation for response structure
3. Update retry logic if needed

### Phase 3: Optimization

1. Optimize response parsing performance
2. Add additional error recovery mechanisms
3. Enhance logging and debugging capabilities
