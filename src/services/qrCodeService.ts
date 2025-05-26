
import { supabase } from "@/integrations/supabase/client";

export interface ScannedProduct {
  id: string;
  product_id: string;
  user_id?: string;
  image_url?: string;
  qr_data: string;
  created_at: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
}

export class QRCodeService {
  /**
   * Process QR code data and extract product information
   */
  static async processQRCode(qrData: string): Promise<{
    productId: string;
    isValid: boolean;
    productInfo?: any;
  }> {
    console.log("Processing QR code data:", qrData);
    
    try {
      // Try to parse QR data as JSON first
      let productId = qrData;
      let productInfo = null;
      
      try {
        const parsedData = JSON.parse(qrData);
        productId = parsedData.product_id || parsedData.id || qrData;
        productInfo = parsedData;
      } catch {
        // If not JSON, treat as plain product ID
        productId = qrData;
      }
      
      // Validate product exists in our system
      const isValid = await this.validateProduct(productId);
      
      return {
        productId,
        isValid,
        productInfo
      };
    } catch (error) {
      console.error("Error processing QR code:", error);
      return {
        productId: qrData,
        isValid: false
      };
    }
  }

  /**
   * Check if product exists and if user has already scanned it
   */
  static async validateProduct(productId: string): Promise<boolean> {
    try {
      // In a real implementation, you would check against your products database
      // For now, we'll validate against known product IDs
      const validProductIds = [
        'indomie',
        'indomie-chicken',
        'indomie-beef',
        'indomie-curry',
        'indomie-vegetable'
      ];
      
      return validProductIds.includes(productId) || productId.startsWith('indomie');
    } catch (error) {
      console.error("Error validating product:", error);
      return false;
    }
  }

  /**
   * Check if user has already scanned this product
   */
  static async checkDuplicateSubmission(productId: string, userId?: string): Promise<{
    isDuplicate: boolean;
    existingSubmission?: ScannedProduct;
  }> {
    try {
      console.log("Checking for duplicate submission:", { productId, userId });
      
      let query = supabase
        .from('scanned_products')
        .select('*')
        .eq('product_id', productId);
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error checking duplicate submission:", error);
        return { isDuplicate: false };
      }
      
      const isDuplicate = data && data.length > 0;
      
      return {
        isDuplicate,
        existingSubmission: isDuplicate ? data[0] : undefined
      };
    } catch (error) {
      console.error("Error in checkDuplicateSubmission:", error);
      return { isDuplicate: false };
    }
  }

  /**
   * Save scanned product to database
   */
  static async saveScannedProduct(data: {
    product_id: string;
    user_id?: string;
    image_url?: string;
    qr_data: string;
  }): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      console.log("Saving scanned product:", data);
      
      const { data: result, error } = await supabase
        .from('scanned_products')
        .insert([{
          product_id: data.product_id,
          user_id: data.user_id,
          image_url: data.image_url,
          qr_data: data.qr_data
        }])
        .select()
        .single();
      
      if (error) {
        console.error("Error saving scanned product:", error);
        return { success: false, error: error.message };
      }
      
      console.log("Scanned product saved successfully:", result);
      return { success: true, id: result.id };
    } catch (error) {
      console.error("Error in saveScannedProduct:", error);
      return { success: false, error: "Failed to save scanned product" };
    }
  }

  /**
   * Perform OCR on image to extract text
   */
  static async performOCR(imageFile: File): Promise<OCRResult> {
    try {
      console.log("Performing OCR on image:", imageFile.name);
      
      // Create a canvas to process the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      // Load image
      const img = new Image();
      const imageUrl = URL.createObjectURL(imageFile);
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // For now, return a placeholder OCR result
          // In a real implementation, you would use a service like Tesseract.js
          // or send to a backend OCR service
          console.log("OCR processing complete (placeholder)");
          
          URL.revokeObjectURL(imageUrl);
          
          resolve({
            text: "OCR text extraction placeholder",
            confidence: 0.8
          });
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(imageUrl);
          reject(new Error("Failed to load image for OCR"));
        };
        
        img.src = imageUrl;
      });
    } catch (error) {
      console.error("Error performing OCR:", error);
      return {
        text: "",
        confidence: 0
      };
    }
  }
}
