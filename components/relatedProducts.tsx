import React from 'react'
import ProductCard from './ProductCard'
import type { Product } from '../types/ProductType'

interface RelatedProductsProps {
    currentProduct: Product
    allProducts?: Product[] // Marked as optional
}

const RelatedProductsSection: React.FC<RelatedProductsProps> = ({
    currentProduct,
    allProducts = [], // Fallback to an empty array
}) => {
    const relatedProducts = allProducts.filter(
        (product) =>
            product.category === currentProduct.category && product.id !== currentProduct.id
    )

    if (relatedProducts.length === 0) return null

    return (
        <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )
}

export default RelatedProductsSection
