
import { supabase } from "@/integrations/supabase/client";

export interface ScannedProduct {
  id: string;
  product_id: string;
  user_id?: string;
  image_url?: string;
  barcode_data: string;
  created_at: string;
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
      
      // Basic validation - barcode should be at least 6 digits
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
}
