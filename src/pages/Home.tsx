import ProductCard from "../../components/ProductCard"
import Products from "../../lib/data"

export default function Home() {
    return (
        <section className="p-4 md:p-10 gap-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 w-full">
                {Products.map((product, index) => (
                    <ProductCard product={product} key={index} />
                ))}
            </div>
        </section>
    )
}
