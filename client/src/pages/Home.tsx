import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../../../shared/types";
import Navigation from "@/components/organisms/Navigation";

export default function Home() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            100% Pure. Zero Compromise. Infinite Customization.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Chicago's only juice bar where YOU control every ingredient—down to the apple variety.
            Never watered down. Always fresh.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/blend-builder" className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition">
              Build Your Perfect Blend
            </Link>
            <Link href="/menu" className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition">
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Featured Juices
        </h2>
        {isLoading ? (
          <div className="text-center text-gray-600">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products?.slice(0, 3).map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                  <div
                    className="h-48 w-full"
                    style={{ backgroundColor: product.color }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {product.description || "Fresh cold-pressed juice"}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">
                        {product.category}
                      </span>
                      <span className="text-gray-500 group-hover:text-green-600 transition">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Garden District Juice</p>
            <p className="text-gray-400">
              Fresh cold-pressed juice delivered daily
            </p>
            <p className="text-gray-400 mt-4">
              © {new Date().getFullYear()} Garden District Juice. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
