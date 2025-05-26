
import { supabase } from "@/integrations/supabase/client";
import Tesseract from 'tesseract.js';

export interface ScannedProduct {
  id: string;
  product_id: string;
  user_id?: string;
  image_url?: string;
  barcode_data: string;
  created_at: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
}

export class BarcodeService {
  /**
   * Process barcode data and extract product information
   */
  static async processBarcodeData(barcodeData: string): Promise<{
    productId: string;
    isValid: boolean;
    productInfo?: any;
  }> {
    console.log("Processing barcode data:", barcodeData);
    
    try {
      // Clean up the barcode data (remove non-numeric characters for standard barcodes)
      const cleanBarcode = barcodeData.replace(/\D/g, '');
      
      // Basic validation - barcode should be at least 6 digits (reduced from 8)
      const isValid = cleanBarcode.length >= 6;
      
      return {
        productId: cleanBarcode,
        isValid,
        productInfo: { 
          barcode: cleanBarcode,
          originalData: barcodeData,
          type: this.identifyBarcodeType(cleanBarcode)
        }
      };
    } catch (error) {
      console.error("Error processing barcode:", error);
      return {
        productId: barcodeData,
        isValid: false
      };
    }
  }

  /**
   * Identify barcode type based on length and format
   */
  static identifyBarcodeType(barcode: string): string {
    if (barcode.length === 12) return 'UPC-A';
    if (barcode.length === 13) return 'EAN-13';
    if (barcode.length === 8) return 'EAN-8';
    if (barcode.length >= 14) return 'ITF-14';
    if (barcode.length >= 6) return 'Code-128';
    return 'Unknown';
  }

  /**
   * Check if user has already scanned this product using Supabase
   */
  static async checkDuplicateSubmission(productId: string, userId?: string): Promise<{
    isDuplicate: boolean;
    existingSubmission?: ScannedProduct;
  }> {
    try {
      console.log("Checking for duplicate submission:", { productId, userId });
      
      // Query the scanned_products table
      let query = supabase
        .from('scanned_products')
        .select('*')
        .eq('product_id', productId);
      
      // If userId is provided, filter by user as well
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error checking duplicates:", error);
        return { isDuplicate: false };
      }
      
      const existingSubmission = data && data.length > 0 ? data[0] as ScannedProduct : undefined;
      
      return {
        isDuplicate: !!existingSubmission,
        existingSubmission
      };
    } catch (error) {
      console.error("Error in checkDuplicateSubmission:", error);
      return { isDuplicate: false };
    }
  }

  /**
   * Save scanned product to Supabase
   */
  static async saveScannedProduct(data: {
    product_id: string;
    user_id?: string;
    image_url?: string;
    barcode_data: string;
  }): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      console.log("Saving scanned product to Supabase:", data);
      
      const insertData = {
        product_id: data.product_id,
        user_id: data.user_id || null,
        image_url: data.image_url || null,
        barcode_data: data.barcode_data
      };
      
      console.log("Insert data:", insertData);
      
      const { data: insertResult, error } = await supabase
        .from('scanned_products')
        .insert([insertData])
        .select()
        .single();
      
      if (error) {
        console.error("Supabase error saving scanned product:", error);
        return { success: false, error: error.message };
      }
      
      console.log("Scanned product saved successfully:", insertResult);
      return { success: true, id: insertResult.id };
    } catch (error) {
      console.error("Error in saveScannedProduct:", error);
      return { success: false, error: "Failed to save scanned product: " + (error as Error).message };
    }
  }

  /**
   * Perform OCR on image to extract barcode text
   */
  static async performOCR(imageFile: File): Promise<OCRResult> {
    try {
      console.log("Performing OCR on image for barcode recognition:", imageFile.name);
      
      // Use Tesseract.js to perform OCR with specific settings for barcode detection
      const { data: { text, confidence } } = await Tesseract.recognize(
        imageFile,
        'eng',
        {
          logger: m => console.log('OCR Progress:', m),
          tessedit_char_whitelist: '0123456789' // Only recognize numbers for barcodes
        }
      );
      
      console.log("OCR Result:", { text, confidence });
      
      // Extract potential barcode numbers from the OCR text
      // Look for sequences of 6 or more digits (reduced from 8)
      const barcodePattern = /\b\d{6,}\b/g;
      const matches = text.match(barcodePattern);
      
      // Get the longest sequence of digits as it's likely the barcode
      let extractedBarcode = '';
      if (matches && matches.length > 0) {
        extractedBarcode = matches.reduce((longest, current) => 
          current.length > longest.length ? current : longest
        );
      } else {
        // Fallback: extract all digits if they form a reasonable barcode
        const allDigits = text.replace(/\D/g, '');
        if (allDigits.length >= 6) {
          extractedBarcode = allDigits;
        }
      }
      
      console.log("Extracted barcode:", extractedBarcode);
      
      return {
        text: extractedBarcode,
        confidence: confidence / 100 // Convert to 0-1 range
      };
    } catch (error) {
      console.error("Error performing OCR:", error);
      return {
        text: "",
        confidence: 0
      };
    }
  }

  /**
   * Process image to extract barcode using OCR
   */
  static async extractBarcodeFromImage(imageFile: File): Promise<{
    barcode: string;
    confidence: number;
    isValid: boolean;
  }> {
    try {
      const ocrResult = await this.performOCR(imageFile);
      
      if (ocrResult.text && ocrResult.text.length >= 6) {
        const processResult = await this.processBarcodeData(ocrResult.text);
        
        return {
          barcode: ocrResult.text,
          confidence: ocrResult.confidence,
          isValid: processResult.isValid
        };
      }
      
      return {
        barcode: "",
        confidence: 0,
        isValid: false
      };
    } catch (error) {
      console.error("Error extracting barcode from image:", error);
      return {
        barcode: "",
        confidence: 0,
        isValid: false
      };
    }
  }
}
