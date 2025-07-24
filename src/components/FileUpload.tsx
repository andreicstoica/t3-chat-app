import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Upload, AlertCircle } from "lucide-react";
import React, { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { validateImageFile, convertFileToBase64, SUPPORTED_IMAGE_TYPES } from "~/lib/utils";
import { Alert, AlertDescription } from "~/components/ui/alert";

export interface ImagePreview {
  file: File;
  base64: string;
  preview: string;
}

export interface Attachment {
  name?: string;
  contentType?: string;
  url: string;
}

interface FileUploadProps {
  onFilesSelected: Dispatch<SetStateAction<FileList | undefined>>;
  onImagePreview?: Dispatch<SetStateAction<ImagePreview | undefined>>;
  onAttachmentCreated?: Dispatch<SetStateAction<Attachment | undefined>>;
  imagePreview?: ImagePreview;
}

export default function FileUploadButton({
  onFilesSelected,
  onImagePreview,
  onAttachmentCreated,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(undefined);
    setIsProcessing(true);

    try {
      const file = files[0]; // Take only the first file for image preview
      if (!file) {
        setError('No file selected');
        setIsProcessing(false);
        return;
      }

      // Validate the file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setError(validation.error);
        setIsProcessing(false);
        return;
      }

      // Convert to base64 for AI processing
      const base64 = await convertFileToBase64(file);

      // Create preview URL for display
      const preview = URL.createObjectURL(file);

      // Set the image preview
      if (onImagePreview) {
        onImagePreview({
          file,
          base64,
          preview
        });
      }

      // Create attachment object for AI SDK
      if (onAttachmentCreated) {
        onAttachmentCreated({
          name: file.name,
          contentType: file.type,
          url: base64 // Use the base64 data URL
        });
      }

      // Set files for the chat submission
      onFilesSelected(files);

    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('File processing error:', err);
    } finally {
      setIsProcessing(false);
      // Clear the input value to allow selecting the same file again
      event.target.value = "";
    }
  };



  return (
    <div className="flex flex-col gap-2">
      {/* Error display */}
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}



      <div className="flex items-center gap-2">
        {/* Hidden file input */}
        <Input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={SUPPORTED_IMAGE_TYPES.join(',')}
          ref={fileInputRef}
        />

        {/* Visible button with icon */}
        <Button
          type="button"
          onClick={handleButtonClick}
          variant="ghost"
          size="icon"
          className="hover:cursor-pointer"
          disabled={isProcessing}
        >
          <Upload className="h-4 w-4" />
          <span className="sr-only">Upload tarot spread image</span>
        </Button>

        {isProcessing && (
          <span className="text-sm text-muted-foreground">Processing image...</span>
        )}
      </div>
    </div>
  );
}
