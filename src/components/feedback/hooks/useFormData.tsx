
import { useState } from "react";

export function useFormData() {
  const [formData, setFormData] = useState({
    customerName: "",
    location: "",
    comments: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    formData,
    handleInputChange
  };
}
