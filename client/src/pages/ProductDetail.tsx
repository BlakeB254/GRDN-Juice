import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "../../../shared/types";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h1>
          <Link href="/menu">
            <a className="text-green-600 hover:text-green-700">
              ← Back to Menu
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-green-600">
                Garden District Juice
              </a>
            </Link>
            <div className="flex gap-6">
              <Link href="/menu">
                <a className="text-gray-700 hover:text-green-600">Menu</a>
              </Link>
              <Link href="/login">
                <a className="text-gray-700 hover:text-green-600">Login</a>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/menu">
          <a className="text-green-600 hover:text-green-700 mb-6 inline-block">
            ← Back to Menu
          </a>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div
              className="w-full h-96 rounded-lg"
              style={{ backgroundColor: product.color }}
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {product.description || "Fresh cold-pressed juice"}
            </p>

            <div className="mb-6">
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {product.category.replace("_", " ")}
              </span>
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold ml-2">
                {product.juiceType}
              </span>
            </div>

            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ingredients
                </h3>
                <ul className="list-disc list-inside text-gray-600">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.productSizes && product.productSizes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Available Sizes
                </h3>
                <div className="space-y-2">
                  {product.productSizes.map((size) => (
                    <div
                      key={size.id}
                      className="flex justify-between items-center p-4 border rounded-lg hover:border-green-500 transition"
                    >
                      <span className="font-medium">{size.sizeName}</span>
                      <span className="text-gray-600">{size.ounces} oz</span>
                      <span className="text-green-600 font-bold">
                        ${size.totalPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="w-full bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition">
              Add to Cart (Coming Soon)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
