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
import { cn } from '@/lib/utils';

interface Category {
  _id: string;
  name: string;
  parentId?: string;
}

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  discount: string;
  category: string;
  subCategory: string;
  stockQuantity: string;
  inStock: boolean;
  rating: string;
  reviews: string;
  soldCount: string;
  additionalSpecifications: string;
  images: string[];
}

interface ImageUploadProps {
  images: string[];
  onChange: (urls: string[]) => void;
  token: string;
  multiple?: boolean;
  label?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
  token,
  multiple = true,
  label = "Click to upload or drag and drop",
  className
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const filesArray = Array.from(files);
      const response = multiple
        ? await adminAPI.upload.multipleImages(filesArray, token)
        : await adminAPI.upload.singleImage(filesArray[0], token);

      if (response.success) {
        const newUrls = multiple ? response.data.urls : [response.data.url];
        onChange(multiple ? [...images, ...newUrls] : newUrls);
        toast({ title: "Success", description: "Images uploaded successfully" });
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (err: any) {
      toast({
        title: "Upload Error",
        description: err.message || "Failed to upload images",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all",
          uploading && "opacity-50 pointer-events-none border-primary animate-pulse"
        )}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleUpload(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          multiple={multiple}
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => handleUpload(e.target.files)}
          accept="image/*"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-primary">Uploading to cloud...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <button
                type="button"
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(images.filter((_, i) => i !== index));
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface Specification {
  key: string;
  value: string;
}

interface VariantOption {
  name: string;
  values: string;
}

interface VariantCombination {
  attributes: Record<string, string>;
  price: string;
  originalPrice: string;
  stockQuantity: string;
  sku: string;
  images: string[];
}

interface AddProductFormProps {
  onClose: () => void;
  onProductAdded?: () => void;
  onProductUpdated?: () => void;
  token: string;
  mode?: 'add' | 'edit';
  product?: {
    id: string;
    title: string;
    description?: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    category: string;
    subCategory: string;
    stockQuantity: number;
    inStock: boolean;
    rating: number;
    reviews: number;
    soldCount: number;
    images: string[];
    additionalSpecifications?: any;
    variantOptions?: any[];
    variantCombinations?: any[];
  } | null;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onClose, onProductAdded, onProductUpdated, token, mode = 'add', product = null }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
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

  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [variantCombinations, setVariantCombinations] = useState<VariantCombination[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Prefill when editing
  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData(prev => ({
        ...prev,
        title: product.title || '',
        description: product.description || '',
        price: product.price != null ? String(product.price) : '',
        originalPrice: product.originalPrice != null ? String(product.originalPrice) : '',
        discount: product.discount != null ? String(product.discount) : '',
        category: product.category || '',
        subCategory: product.subCategory || '',
        stockQuantity: product.stockQuantity != null ? String(product.stockQuantity) : '',
        inStock: product.inStock ?? true,
        rating: product.rating != null ? String(product.rating) : '0',
        reviews: product.reviews != null ? String(product.reviews) : '0',
        soldCount: product.soldCount != null ? String(product.soldCount) : '0',
        images: product.images || [],
        additionalSpecifications: typeof product.additionalSpecifications === 'string'
          ? product.additionalSpecifications
          : JSON.stringify(product.additionalSpecifications || {})
      }));
    } else {
      setSpecifications([]);
      setVariantOptions([]);
      setVariantCombinations([]);
    }

    // This block should only run if product exists, regardless of mode, for initial setup
    if (product) {
      if (product.additionalSpecifications) {
        let specsObj = product.additionalSpecifications;

        // Handle if it comes as a string (JSON) or actual object
        if (typeof specsObj === 'string') {
          try {
            // First try JSON parse
            specsObj = JSON.parse(specsObj);
          } catch (e) {
            // If not valid JSON, check for old semicolon format "KEY:VAL;"
            if (typeof specsObj === 'string' && specsObj.includes(':')) {
              const oldFormatSpecs = specsObj.split(';').reduce((acc: any, curr: string) => {
                const part = curr.trim();
                if (part) {
                  const [k, v] = part.split(':');
                  if (k && v) acc[k.trim()] = v.trim();
                }
                return acc;
              }, {});
              specsObj = oldFormatSpecs;
            } else {
              // Fallback to empty if neither JSON nor formatted string
              specsObj = {};
            }
          }
        }

        // Now specsObj should be an object. Convert to array for state.
        const loadedSpecs = Object.entries(specsObj).map(([key, value]) => ({
          key,
          value: Array.isArray(value)
            ? value.join(',')
            : String(value).replace(/^"(.*)"$/, '$1').replace(/"/g, '')
        }));
        setSpecifications(loadedSpecs);
      } else {
        setSpecifications([]);
      }

      // Handle variantOptions
      if (product.variantOptions && Array.isArray(product.variantOptions)) {
        setVariantOptions(product.variantOptions.map(opt => ({
          name: opt.name,
          values: opt.values.join(', ')
        })));
      } else {
        setVariantOptions([]);
      }

      // Handle variantCombinations
      if (product.variantCombinations && Array.isArray(product.variantCombinations)) {
        setVariantCombinations(product.variantCombinations.map(combo => ({
          attributes: combo.attributes || {},
          price: String(combo.price || ''),
          originalPrice: String(combo.originalPrice || ''),
          stockQuantity: String(combo.stockQuantity || ''),
          sku: combo.sku || '',
          images: combo.images || []
        })));
      } else {
        setVariantCombinations([]);
      }
    } else {
      setSpecifications([]);
      setVariantOptions([]);
      setVariantCombinations([]);
    }
  }, [mode, product?.id]);

  const generateCombinations = () => {
    const activeOptions = variantOptions.filter(opt => opt.name.trim() && opt.values.trim());
    if (activeOptions.length === 0) return;

    const valuesArray = activeOptions.map(opt =>
      opt.values.split(',').map(v => v.trim()).filter(v => v)
    );

    const getCartesian = (arrays: string[][]) => {
      return arrays.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())), [[]] as string[][]);
    };

    const combinations = getCartesian(valuesArray);

    const newCombinations = combinations.map(combo => {
      const attributes: Record<string, string> = {};
      activeOptions.forEach((opt, index) => {
        attributes[opt.name] = combo[index];
      });

      // Try to find existing combo to preserve values
      const existing = variantCombinations.find(c =>
        Object.entries(attributes).every(([k, v]) => c.attributes[k] === v)
      );

      return existing || {
        attributes,
        price: formData.price,
        originalPrice: formData.originalPrice,
        stockQuantity: formData.stockQuantity,
        sku: '',
        images: []
      };
    });

    setVariantCombinations(newCombinations);
    toast({
      title: "Generated",
      description: `Generated ${newCombinations.length} combinations based on options.`,
    });
  };

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      const parentCategory = categories.find(cat => cat.name === formData.category || cat._id === formData.category);

      if (parentCategory) {
        const subs = categories.filter(cat => cat.parentId === parentCategory._id);
        setSubCategories(subs);
      } else {
        setSubCategories([]);
      }
    } else {
      setSubCategories([]);
    }
  }, [formData.category, categories]);

  const loadCategories = async () => {
    try {
      const response = await adminAPI.categories.getAll();
      if (response.success) {
        setCategories(response.data);
        if (mode === 'edit' && product) {
          const matchString = (a?: string, b?: string) => {
            if (!a || !b) return false;
            return a.trim().toLowerCase() === b.trim().toLowerCase() || a === b;
          };
          const parent = response.data.find((c: Category) => !c.parentId && (matchString(c.name, product.category) || c._id === product.category));
          const sub = response.data.find((c: Category) => c.parentId === parent?._id && (matchString(c.name, product.subCategory) || c._id === product.subCategory));
          
          setFormData(prev => ({
            ...prev,
            category: parent?.name || product.category || '',
            subCategory: sub?.name || product.subCategory || ''
          }));
          
          if (parent) {
            const subs = response.data.filter((cat: Category) => cat.parentId === parent._id);
            setSubCategories(subs);
          }
        }
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

  const handleInputChange = (field: keyof Omit<ProductFormData, 'images'>, value: string | boolean) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value };

      if (field === 'category') {
        newState.subCategory = '';
      }

      if (field === 'originalPrice' || field === 'discount') {
        const op = parseFloat(field === 'originalPrice' ? (value as string) : newState.originalPrice);
        const disc = parseFloat(field === 'discount' ? (value as string) : newState.discount);

        if (!isNaN(op) && !isNaN(disc)) {
          const sellingPrice = op - (op * disc / 100);
          newState.price = sellingPrice.toFixed(2);
        } else if (!isNaN(op) && (isNaN(disc) || disc === 0)) {
          newState.price = op.toFixed(2);
        }
      }
      return newState as ProductFormData;
    });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.subCategory) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const validPrices = variantCombinations.map(c => parseFloat(c.price)).filter(p => !isNaN(p) && p > 0);
      const lowestComboPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
      
      const validOrigPrices = variantCombinations.map(c => parseFloat(c.originalPrice)).filter(p => !isNaN(p) && p > 0);
      const lowestComboOrigPrice = validOrigPrices.length > 0 ? Math.min(...validOrigPrices) : 0;

      const firstComboImages = variantCombinations.length > 0 && variantCombinations[0].images?.length > 0 ? variantCombinations[0].images : [];

      const totalStock = variantCombinations.reduce((sum, c) => sum + (parseInt(c.stockQuantity) || 0), 0);
      const isOverallInStock = totalStock > 0;

      // Prepare product data
      const productData = {
        title: formData.title,
        description: formData.description,
        price: lowestComboPrice,
        originalPrice: lowestComboOrigPrice,
        discount: 0,
        category: formData.category,
        subCategory: formData.subCategory,
        stockQuantity: totalStock,
        inStock: isOverallInStock,
        rating: parseFloat(formData.rating) || 0,
        reviews: parseInt(formData.reviews) || 0,
        soldCount: parseInt(formData.soldCount) || 0,
        images: firstComboImages,
        additionalSpecifications: specifications
          .filter(s => s.key.trim() && s.value.trim())
          .map(s => {
            const formatSentenceCase = (str: string) => {
              const trimmed = str.trim();
              if (!trimmed) return '';
              return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
            };

            const formatValue = (val: string) => {
              if (val.includes(',')) {
                return val.split(',').map(part => formatSentenceCase(part)).filter(p => p).join(',');
              }
              return formatSentenceCase(val);
            };

            return `${formatSentenceCase(s.key)}:${formatValue(s.value)}`;
          })
          .join(';'),
        variantOptions: variantOptions
          .filter(v => v.name.trim() && v.values.trim())
          .map(v => ({
            name: v.name.trim(),
            values: v.values.split(',').map(opt => opt.trim()).filter(opt => opt)
          })),
        variantCombinations: variantCombinations.map(combo => ({
          attributes: combo.attributes,
          price: parseFloat(combo.price) || 0,
          originalPrice: parseFloat(combo.originalPrice) || 0,
          stockQuantity: parseInt(combo.stockQuantity) || 0,
          sku: combo.sku,
          images: combo.images
        }))
      };

      // Create or Update product
      const response = mode === 'edit' && product
        ? await adminAPI.products.update(product.id, productData, token)
        : await adminAPI.products.create(productData, token);

      if (response.success) {
        toast({
          title: "Success",
          description: mode === 'edit' ? 'Product updated successfully!' : 'Product created successfully!',
        });
        if (mode === 'edit') {
          onProductUpdated && onProductUpdated();
        } else {
          onProductAdded && onProductAdded();
        }
        onClose();
      } else {
        throw new Error(response.message || (mode === 'edit' ? 'Failed to update product' : 'Failed to create product'));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || (mode === 'edit' ? 'Failed to update product' : 'Failed to create product'),
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
            {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select key={`cat-${categories.length}`} value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => !cat.parentId).map(category => (
                      <SelectItem key={category._id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subCategory">Sub Category *</Label>
                <Select
                  key={`subcat-${subCategories.length}`}
                  value={formData.subCategory}
                  onValueChange={(value) => handleInputChange('subCategory', value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub category" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map(subCategory => (
                      <SelectItem key={subCategory._id} value={subCategory.name}>
                        {subCategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>


            {/* Additional Specifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Additional Specifications</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSpecifications([...specifications, { key: '', value: '' }])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>

              {specifications.length === 0 && (
                <p className="text-sm text-gray-500 italic">No specifications added yet.</p>
              )}

              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <Input
                        placeholder="Key (e.g. Battery)"
                        value={spec.key}
                        onChange={(e) => {
                          const newSpecs = [...specifications];
                          newSpecs[index].key = e.target.value;
                          setSpecifications(newSpecs);
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Value (e.g. 5000mAh)"
                        value={spec.value}
                        onChange={(e) => {
                          const newSpecs = [...specifications];
                          newSpecs[index].value = e.target.value;
                          setSpecifications(newSpecs);
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        const newSpecs = specifications.filter((_, i) => i !== index);
                        setSpecifications(newSpecs);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Values can be comma-separated for multiple options (e.g. "Red, Blue, Green").
              </p>
            </div>

            {/* Product Variants Section */}
            <div className="space-y-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">Variant Options</Label>
                  <p className="text-sm text-muted-foreground">Define your variant types (e.g. Color, Size)</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setVariantOptions([...variantOptions, { name: '', values: '' }])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {variantOptions.map((opt, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="w-1/3">
                      <Input
                        placeholder="Option Name (e.g. Color)"
                        value={opt.name}
                        onChange={(e) => {
                          const newOpts = [...variantOptions];
                          newOpts[index].name = e.target.value;
                          setVariantOptions(newOpts);
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Values (comma separated: Red, Blue)"
                        value={opt.values}
                        onChange={(e) => {
                          const newOpts = [...variantOptions];
                          newOpts[index].values = e.target.value;
                          setVariantOptions(newOpts);
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 h-10 w-10"
                      onClick={() => {
                        setVariantOptions(variantOptions.filter((_, i) => i !== index));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {variantOptions.some(o => o.name && o.values) && (
                <div className="flex justify-center py-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full md:w-auto"
                    onClick={generateCombinations}
                  >
                    Generate Specific Combinations
                  </Button>
                </div>
              )}

              {variantCombinations.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">Combinations Data</Label>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Variant</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Orig. Price (₹)</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Discount (%)</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Final Price (₹)</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Stock</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">SKU</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Images</th>
                          <th className="px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {variantCombinations.map((combo, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm font-medium">
                              {Object.entries(combo.attributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                            </td>
                            <td className="px-4 py-2">
                              <Input
                                type="number"
                                className="h-8 w-24"
                                placeholder="Orig. Price"
                                value={combo.originalPrice}
                                onChange={(e) => {
                                  const newCombos = [...variantCombinations];
                                  newCombos[index].originalPrice = e.target.value;
                                  setVariantCombinations(newCombos);
                                }}
                              />
                            </td>
                            <td className="px-4 py-2">
                              <Input
                                type="number"
                                className="h-8 w-20"
                                placeholder="Discount %"
                                onChange={(e) => {
                                  const disc = parseFloat(e.target.value);
                                  const op = parseFloat(combo.originalPrice);
                                  const newCombos = [...variantCombinations];
                                  if (!isNaN(disc) && !isNaN(op)) {
                                     newCombos[index].price = (op - (op * disc / 100)).toFixed(2);
                                  }
                                  setVariantCombinations(newCombos);
                                }}
                              />
                            </td>
                            <td className="px-4 py-2">
                              <Input
                                type="number"
                                className="h-8 w-24"
                                placeholder="Final Price"
                                value={combo.price}
                                onChange={(e) => {
                                  const newCombos = [...variantCombinations];
                                  newCombos[index].price = e.target.value;
                                  setVariantCombinations(newCombos);
                                }}
                              />
                            </td>
                            <td className="px-4 py-2">
                              <Input
                                type="number"
                                className="h-8 w-20"
                                value={combo.stockQuantity}
                                onChange={(e) => {
                                  const newCombos = [...variantCombinations];
                                  newCombos[index].stockQuantity = e.target.value;
                                  setVariantCombinations(newCombos);
                                }}
                              />
                            </td>
                            <td className="px-4 py-2">
                              <Input
                                className="h-8 w-24"
                                value={combo.sku}
                                onChange={(e) => {
                                  const newCombos = [...variantCombinations];
                                  newCombos[index].sku = e.target.value;
                                  setVariantCombinations(newCombos);
                                }}
                              />
                            </td>
                            <td className="px-4 py-2">
                              <div className="min-w-[150px]">
                                <ImageUpload
                                  images={combo.images}
                                  onChange={(urls) => {
                                    const newCombos = [...variantCombinations];
                                    newCombos[index].images = urls;
                                    setVariantCombinations(newCombos);
                                  }}
                                  token={token}
                                  label="Drop images"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-2 text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500"
                                onClick={() => {
                                  setVariantCombinations(variantCombinations.filter((_, i) => i !== index));
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {mode === 'edit' ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  mode === 'edit' ? 'Update Product' : 'Create Product'
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
