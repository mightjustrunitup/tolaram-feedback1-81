
import React, { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, X, Camera } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface IssueSelectionProps {
  issues: string[];
  selectedIssues: string[];
  comments: string;
  handleIssueToggle: (issue: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errors: { [key: string]: string };
  uploadedImages?: string[];
  onImageUpload?: (files: FileList) => void;
  onImageRemove?: (index: number) => void;
  isCameraActive?: boolean;
  onCameraCapture?: (imageData: string) => void;
  onToggleCamera?: () => void;
}

export const IssueSelection: React.FC<IssueSelectionProps> = ({
  issues,
  selectedIssues,
  comments,
  handleIssueToggle,
  onInputChange,
  errors,
  uploadedImages = [],
  onImageUpload,
  onImageRemove,
  isCameraActive = false,
  onCameraCapture,
  onToggleCamera
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [isAttaching, setIsAttaching] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCamera, setHasCamera] = useState(false);

  // Check if device has camera capability
  useEffect(() => {
    if (isMobile && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setHasCamera(true);
    }
  }, [isMobile]);

  // Handle camera stream when active
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    if (isCameraActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(error => console.error("Error playing video:", error));
          }
        })
        .catch(error => {
          console.error("Error accessing camera:", error);
          if (onToggleCamera) onToggleCamera();
          toast({
            title: "Camera Error",
            description: "Could not access camera. Please check permissions.",
            variant: "destructive",
          });
        });
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive, onToggleCamera]);

  const handleFileButtonClick = () => {
    setIsAttaching(true);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onImageUpload) {
      onImageUpload(e.target.files);
      // Reset the file input so the same file can be selected again
      e.target.value = '';
      // Set isAttaching to false to hide the input on mobile after file selection
      setIsAttaching(false);
    } else {
      // If no files were selected, reset the attaching state
      setIsAttaching(false);
    }
  };

  const handleCancelAttach = () => {
    setIsAttaching(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && onCameraCapture) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas content to data URL and pass to handler
        const imageData = canvas.toDataURL('image/jpeg');
        onCameraCapture(imageData);
      }
    }
  };

  // Define product issues if none are provided
  const displayedIssues = issues.length > 0 ? issues : [
    "Mislabelled products",
    "Unusual taste or odor",
    "Texture - too hard or soft",
    "Mold or spoilage",
    "Foreign elements"
  ];

  return (
    <>
      <div className="space-y-2 p-3 bg-white/80 rounded-md backdrop-blur-sm border border-gray-200">
        <Label className="text-sm font-medium flex justify-between">
          <span>Which issues did you experience with this product?</span>
          <span className="text-red-500">*</span>
        </Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {displayedIssues.map((issue) => (
            <div 
              key={issue} 
              className={`flex items-center space-x-2 rounded-md p-1.5 transition-colors ${selectedIssues.includes(issue) ? 'bg-gray-50 border border-gray-200' : 'bg-white border border-gray-100 hover:bg-gray-50/30'}`}
            >
              <Checkbox 
                id={issue.replace(/\s/g, '-')}
                checked={selectedIssues.includes(issue)}
                onCheckedChange={() => handleIssueToggle(issue)}
              />
              <Label
                htmlFor={issue.replace(/\s/g, '-')}
                className="text-xs md:text-sm font-medium leading-none cursor-pointer"
              >
                {issue}
              </Label>
            </div>
          ))}
        </div>
        
        {errors.issue && (
          <p className="text-xs text-red-500 mt-1">{errors.issue}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="comments" className="text-sm">Additional Comments</Label>
        <div className="relative">
          <Textarea
            id="comments"
            name="comments"
            placeholder="Please share any additional details about the issues you experienced..."
            className="min-h-[100px] text-sm"
            value={comments}
            onChange={onInputChange}
          />
          
          {/* Image upload buttons */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              onClick={(e) => isAttaching ? e.stopPropagation() : null}
            />
            
            {isMobile && isAttaching && (
              <Button
                type="button"
                variant="ghost" 
                size="sm"
                onClick={handleCancelAttach}
                className="bg-gray-100 hover:bg-gray-200 flex items-center"
                title="Cancel image attachment"
              >
                <X size={14} />
              </Button>
            )}
            
            {/* Only show Camera button on mobile */}
            {isMobile && hasCamera && onToggleCamera && (
              <Button
                type="button"
                variant="ghost" 
                size="sm"
                onClick={onToggleCamera}
                className="bg-transparent hover:bg-gray-100 flex items-center"
                title="Take a photo"
              >
                <Camera size={14} />
              </Button>
            )}
            
            {/* Only show Attach button on web (non-mobile) */}
            {!isMobile && (
              <Button
                type="button"
                variant="ghost" 
                size="sm"
                onClick={handleFileButtonClick}
                className="bg-transparent hover:bg-gray-100 flex items-center"
                title="Attach images to your feedback"
              >
                <Paperclip size={14} />
              </Button>
            )}
          </div>
        </div>
        
        {/* Display uploaded images with delete option */}
        {uploadedImages.length > 0 && (
          <div className="mt-1">
            <p className="text-xs text-gray-500 mb-1">Uploaded images:</p>
            <div className="flex flex-wrap gap-2">
              {uploadedImages.map((src, index) => (
                <div key={index} className="relative w-16 h-16 border rounded overflow-hidden group">
                  <img 
                    src={src} 
                    alt={`Uploaded image ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                  {onImageRemove && (
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-black/60 p-1 rounded-bl md:hidden md:group-hover:block"
                      onClick={() => onImageRemove(index)}
                      title="Remove image"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Camera Dialog */}
      <Dialog open={isCameraActive} onOpenChange={() => onToggleCamera && onToggleCamera()}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center space-y-4 pt-2">
            <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay 
                playsInline 
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex justify-center gap-4 w-full">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onToggleCamera && onToggleCamera()}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={capturePhoto}
                className="bg-indomie-red hover:bg-indomie-red/90"
              >
                Capture Photo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
