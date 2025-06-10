import { Input } from "~/components/ui/input"; // Assuming this path
import { Button } from "~/components/ui/button"; // Assuming this path
import { Upload } from "lucide-react"; // Or your preferred icon library
import React, { useRef, type Dispatch, type SetStateAction } from "react"; // Import React useRef

// Assuming you have a place for your file input functionality
interface ChatInputProps {
  // You might pass setFiles from here if it's a shared state
  onFilesSelected: Dispatch<SetStateAction<FileList | undefined>>;
}

export default function FileUploadButton({ onFilesSelected }: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(event.target.files);
    }
    // Clear the value to allow selecting the same file again if needed
    // This is important because onChange doesn't fire if the same file is selected
    event.target.value = "";
  };

  return (
    <>
      {/* Hidden file input */}
      <Input
        type="file"
        className="hidden" // Hides the input visually
        onChange={handleFileChange}
        multiple // Retain multiple selection if needed
        ref={fileInputRef}
      />

      {/* Visible button with icon */}
      <Button
        type="button" // Important: Prevent form submission if inside a form
        onClick={handleButtonClick}
        variant="ghost" // Or whatever variant fits your design
        size="icon" // Makes the button square and centers the icon
        className="hover:cursor-pointer"
      >
        <Upload className="h-4 w-4" /> {/* Your upload icon */}
        <span className="sr-only">Upload file(s)</span>{" "}
        {/* For accessibility */}
      </Button>
    </>
  );
}
