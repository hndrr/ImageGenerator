# Requirements Document

## Introduction

This feature addresses the GoogleGenerativeAI error "Unsupported response mime type when response schema is set" by migrating from the `@google/generative-ai` library to the newer `@google/genai` library. The current implementation fails because the older library has limitations with image generation and response schemas. The newer `@google/genai` library provides better support for image generation workflows.

## Requirements

### Requirement 1

**User Story:** As a user of the image generator application, I want the Gemini API integration to work without errors, so that I can successfully generate images using prompts and input images.

#### Acceptance Criteria

1. WHEN a user clicks the "画像を生成" button THEN the system SHALL successfully call the Gemini API using the updated `@google/genai` library
2. WHEN the Gemini API responds with image data THEN the system SHALL properly extract and display the generated image using the new library's response format
3. WHEN the API call fails THEN the system SHALL provide clear error messages to help users understand what went wrong
4. WHEN using the new library THEN the system SHALL support both image generation and structured responses without conflicts

### Requirement 2

**User Story:** As a developer maintaining the application, I want to use the latest and most stable Gemini API library, so that the application remains compatible with current API features and future updates.

#### Acceptance Criteria

1. WHEN migrating to `@google/genai` THEN the system SHALL use the library's recommended patterns for image generation
2. WHEN processing API responses THEN the system SHALL use the new library's response handling methods
3. WHEN configuring the API client THEN the system SHALL follow the new library's initialization and configuration patterns
4. WHEN handling errors THEN the system SHALL use the new library's error handling mechanisms

### Requirement 3

**User Story:** As a user, I want the application to maintain all existing functionality while fixing the API error, so that I don't lose any features during the fix.

#### Acceptance Criteria

1. WHEN the API fix is implemented THEN all existing UI components SHALL continue to work as before
2. WHEN generating images THEN the system SHALL still support prompts, negative prompts, size selection, and image uploads
3. WHEN viewing results THEN the system SHALL still display response logs, error messages, and generated images
4. WHEN using generated images as input THEN the system SHALL still allow reusing generated images for further processing
