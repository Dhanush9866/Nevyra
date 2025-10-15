import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Plus, Loader2 } from 'lucide-react';
import { adminAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Category {
  _id: string;
  name: string;
  parentId?: string;
}

interface ProductFormData {
  title: string;
  price: string;
  category: string;
  subCategory: string;
  stockQuantity: string;
  inStock: boolean;
  rating: string;
  reviews: string;
  soldCount: string;
  additionalSpecifications: string;
  images: File[];
}

interface AddProductFormProps {
  onClose: () => void;
  onProductAdded: () => void;
  token: string;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onClose, onProductAdded, token }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    price: '',
    category: '',
    subCategory: '',
    stockQuantity: '',
    inStock: true,
    rating: '0',
    reviews: '0',
    soldCount: '0',
    additionalSpecifications: '',
    images: []
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const { toast } = useToast();

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      const parentCategory = categories.find(cat => cat._id === formData.category);
      
      if (parentCategory) {
        const subs = categories.filter(cat => cat.parentId === parentCategory._id);
        setSubCategories(subs);
      } else {
        setSubCategories([]);
      }
    } else {
      setSubCategories([]);
    }
    setFormData(prev => ({ ...prev, subCategory: '' }));
  }, [formData.category, categories]);

  const loadCategories = async () => {
    try {
      const response = await adminAPI.categories.getAll();
      if (response.success) {
        setCategories(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load categories",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (formData.images.length === 0) return [];
    
    setUploadingImages(true);
    try {
      const response = await adminAPI.upload.multipleImages(formData.images, token);
      if (response.success) {
        return response.data.urls;
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.category || !formData.subCategory) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Upload images first
      const imageUrls = await uploadImages();
      
      // Prepare product data
      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        category: formData.category,
        subCategory: formData.subCategory,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        inStock: formData.inStock,
        rating: parseFloat(formData.rating) || 0,
        reviews: parseInt(formData.reviews) || 0,
        soldCount: parseInt(formData.soldCount) || 0,
        images: imageUrls,
        additionalSpecifications: formData.additionalSpecifications
      };

      // Create product
      const response = await adminAPI.products.create(productData, token);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Product created successfully!",
        });
        onProductAdded();
        onClose();
      } else {
        throw new Error(response.message || 'Failed to create product');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Add New Product
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter product title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => !cat.parentId).map(category => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subCategory">Sub Category *</Label>
                <Select 
                  value={formData.subCategory} 
                  onValueChange={(value) => handleInputChange('subCategory', value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub category" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map(subCategory => (
                      <SelectItem key={subCategory._id} value={subCategory._id}>
                        {subCategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stock Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  placeholder="0.0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reviews">Reviews Count</Label>
                <Input
                  id="reviews"
                  type="number"
                  value={formData.reviews}
                  onChange={(e) => handleInputChange('reviews', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="inStock"
                checked={formData.inStock}
                onChange={(e) => handleInputChange('inStock', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="inStock">Product is in stock</Label>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload images or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                </label>
              </div>
              
              {/* Image Previews */}
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Specifications */}
            <div className="space-y-2">
              <Label htmlFor="additionalSpecifications">Additional Specifications</Label>
              <Textarea
                id="additionalSpecifications"
                value={formData.additionalSpecifications}
                onChange={(e) => handleInputChange('additionalSpecifications', e.target.value)}
                placeholder='Enter specifications in format: "BATTERY:20 mah";"COLORS:green,yellow,black";'
                rows={4}
              />
              <p className="text-xs text-gray-500">
                Format: "KEY:value";"KEY2:value1,value2"; Use semicolons to separate specifications, commas for multiple values.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploadingImages}>
                {loading || uploadingImages ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {uploadingImages ? 'Uploading Images...' : 'Creating Product...'}
                  </>
                ) : (
                  'Create Product'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductForm;
