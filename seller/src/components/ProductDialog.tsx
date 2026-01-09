import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Loader2 } from 'lucide-react';
import { sellerAPI } from '@/lib/api';
import { toast } from 'sonner';

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
  lowStockThreshold: string;
  inStock: boolean;
  rating: string;
  reviews: string;
  soldCount: string;
  additionalSpecifications: string;
  images: File[];
}

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
  onSuccess?: () => void;
}

export const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  onOpenChange,
  productId,
  onSuccess
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    price: '',
    category: '',
    subCategory: '',
    stockQuantity: '',
    lowStockThreshold: '5',
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

  // Load categories on component mount
  useEffect(() => {
    if (open) {
      loadCategories();
      if (productId) {
        fetchProductDetails();
      } else {
        resetForm();
      }
    }
  }, [open, productId]);

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

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      category: '',
      subCategory: '',
      stockQuantity: '',
      lowStockThreshold: '5',
      inStock: true,
      rating: '0',
      reviews: '0',
      soldCount: '0',
      additionalSpecifications: '',
      images: []
    });
    setImagePreview([]);
  };

  const loadCategories = async () => {
    try {
      const response = await sellerAPI.categories.list();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await sellerAPI.products.get(productId!);
      if (res.data.success) {
        const product = res.data.data;
        setFormData({
          title: product.title || '',
          price: product.price != null ? String(product.price) : '',
          category: '', // will resolve to id after categories load
          subCategory: '',
          stockQuantity: product.stockQuantity != null ? String(product.stockQuantity) : '',
          lowStockThreshold: product.lowStockThreshold != null ? String(product.lowStockThreshold) : '5',
          inStock: product.inStock ?? true,
          rating: product.rating != null ? String(product.rating) : '0',
          reviews: product.reviews != null ? String(product.reviews) : '0',
          soldCount: product.soldCount != null ? String(product.soldCount) : '0',
          additionalSpecifications: typeof product.additionalSpecifications === 'string' 
            ? product.additionalSpecifications 
            : JSON.stringify(product.additionalSpecifications || {}),
          images: []
        });
        // Show existing image previews
        setImagePreview(product.images || []);

        // Map category/subCategory names to IDs after categories are loaded
        if (categories.length > 0) {
          const parent = categories.find((c: Category) => !c.parentId && c.name === product.category);
          const sub = categories.find((c: Category) => c.parentId && c.name === product.subCategory);
          setFormData(prev => ({
            ...prev,
            category: parent?._id || '',
            subCategory: sub?._id || ''
          }));
          if (parent) {
            const subs = categories.filter((cat: Category) => cat.parentId === parent._id);
            setSubCategories(subs);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
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
      const response = await sellerAPI.auth.uploadImages(formData.images);
      
      if (response.data.success) {
        return response.data.data.urls;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Failed to upload images');
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.category || !formData.subCategory) {
      toast.error('Please fill in all required fields');
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
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
        inStock: formData.inStock,
        rating: parseFloat(formData.rating) || 0,
        reviews: parseInt(formData.reviews) || 0,
        soldCount: parseInt(formData.soldCount) || 0,
        // If editing and no new images uploaded, keep existing ones
        images: imageUrls.length > 0 ? imageUrls : imagePreview,
        additionalSpecifications: formData.additionalSpecifications
      };

      if (productId) {
        await sellerAPI.products.update(productId, productData);
        toast.success('Product updated successfully');
      } else {
        await sellerAPI.products.create(productData);
        toast.success('Product created successfully');
      }
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {productId ? 'Edit Product' : 'Add New Product'}
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {loading && !productId ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
                  placeholder="5"
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploadingImages}>
                {loading || uploadingImages ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {uploadingImages ? 'Uploading Images...' : (productId ? 'Updating Product...' : 'Creating Product...')}
                  </>
                ) : (
                  productId ? 'Update Product' : 'Create Product'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
