import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Loader2 } from 'lucide-react';
import { sellerAPI } from '@/lib/api';
import { toast } from 'sonner';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    subCategory: '',
    stockQuantity: '',
    images: [] as string[],
    newImage: ''
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await sellerAPI.categories.list();
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await sellerAPI.products.get(id!);
      if (res.data.success) {
        const product = res.data.data;
        setFormData({
          title: product.title,
          price: product.price.toString(),
          category: product.category, // Assuming ID or Name match. If ID, might need logic
          subCategory: product.subCategory,
          stockQuantity: product.stockQuantity.toString(),
          images: product.images || [],
          newImage: ''
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (formData.newImage) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, prev.newImage],
        newImage: ''
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        price: parseFloat(formData.price),
        category: formData.category,
        subCategory: formData.subCategory, // Usually dependent on category, simplified here
        stockQuantity: parseInt(formData.stockQuantity),
        images: formData.images,
        inStock: parseInt(formData.stockQuantity) > 0,
        // Default values for required fields
        reviews: 0,
        rating: 0,
        soldCount: 0
      };

      if (isEditing) {
        await sellerAPI.products.update(id!, payload);
        toast.success('Product updated successfully');
      } else {
        await sellerAPI.products.create(payload);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/products')}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-muted-foreground">{isEditing ? 'Update your product details' : 'Create a new product listing'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Title</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="e.g. Cotton T-Shirt" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <input 
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="0.00" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat: any) => (
                  <option key={cat._id || cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sub Category</label>
              <input 
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Sub Category Name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock Quantity</label>
              <input 
                name="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="0" 
                required 
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Product Images</h2>
          <div className="flex gap-2">
            <input 
              name="newImage"
              value={formData.newImage}
              onChange={handleInputChange}
              className="input-field flex-1"
              placeholder="Paste image URL here" 
            />
            <button type="button" onClick={handleAddImage} className="btn-secondary">Add</button>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/products')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
