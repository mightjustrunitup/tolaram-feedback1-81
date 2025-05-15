
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 border-0 shadow-xl bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Camera Capture</DialogTitle>
        </VisuallyHidden>
        
        <div className="relative flex flex-col items-center">
          {/* Close button overlay */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 z-50 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 rounded-full"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
          
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
