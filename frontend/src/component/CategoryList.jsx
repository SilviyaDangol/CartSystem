import React, { useEffect, useState } from 'react';
import { Search, Loader2, FolderIcon, ChevronRight, Package, AlertCircle } from 'lucide-react';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [categoriesResponse, productsResponse] = await Promise.all([
                    fetch('http://localhost:5000/api/categories/all'),
                    fetch('http://localhost:5000/api/products/all')
                ]);

                if (!categoriesResponse.ok) throw new Error(`Categories fetch failed: ${categoriesResponse.statusText}`);
                if (!productsResponse.ok) throw new Error(`Products fetch failed: ${productsResponse.statusText}`);

                const categoriesData = await categoriesResponse.json();
                const productsData = await productsResponse.json();

                console.log('Categories:', categoriesData);
                console.log('Products:', productsData);

                const categoriesArray = Array.isArray(categoriesData.categories) ? categoriesData.categories : [];
                const productsArray = Array.isArray(productsData.products) ? productsData.products : [];

                const categoriesWithCounts = categoriesArray
                    .filter(category => category && typeof category === 'object')
                    .map(category => {
                        const matchingProducts = productsArray.filter(
                            product => product && String(product.category_id) === String(category.id)
                        );
                        console.log(`Category: ${category.name} (ID: ${category.id}), Matches:`, matchingProducts);
                        return {
                            ...category,
                            name: category.name || 'Unnamed Category',
                            productCount: matchingProducts.length
                        };
                    });

                setCategories(categoriesWithCounts);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(category => {
        if (!category || !category.name) return false;
        const categoryName = category.name.toString().toLowerCase();
        const searchQuery = searchTerm.toLowerCase().trim();
        return categoryName.includes(searchQuery);
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="flex items-center gap-2 text-base-content/60">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading categories...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="bg-base-100 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <FolderIcon className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold text-base-content">
                        Categories ({categories.length})
                    </h2>
                </div>
            </div>

            <div className="relative mb-6">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    className="input input-bordered w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredCategories.length > 0 ? (
                <div className="space-y-2">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.id || Math.random()}
                            className={`
                                p-4 rounded-lg border cursor-pointer transition-all
                                hover:border-primary hover:shadow-md
                                ${selectedCategory?.id === category.id
                                ? 'border-primary bg-primary/5'
                                : 'border-base-300 bg-base-100'}
                            `}
                            onClick={() => setSelectedCategory(category)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Package className="w-5 h-5 text-primary" />
                                    <h3 className="font-medium text-base-content">
                                        {category.name}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-base-content/60">
                                        {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-base-content/40" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    {searchTerm ? (
                        <div className="text-base-content/60">
                            <p>No categories found matching "{searchTerm}"</p>
                            <button
                                className="btn btn-ghost btn-sm mt-2"
                                onClick={() => setSearchTerm('')}
                            >
                                Clear search
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-base-content/60">
                            <FolderIcon className="w-12 h-12" />
                            <p>No categories available.</p>
                            <p className="text-sm">Start by adding your first category!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryList;