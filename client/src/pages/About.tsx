import { Link } from "wouter";
import Navigation from "@/components/organisms/Navigation";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Welcome to Garden District Juice, your local source for fresh,
            cold-pressed juice made from organic, locally-sourced ingredients.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
            Our Story
          </h2>
          <p className="text-gray-600 mb-6">
            Founded in the heart of the Garden District, we're passionate about
            bringing you the freshest, most nutritious juices possible. Every
            bottle is cold-pressed to preserve maximum nutrients and flavor.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
            Why Cold-Pressed?
          </h2>
          <p className="text-gray-600 mb-6">
            Cold-pressing extracts juice without heat, preserving enzymes,
            vitamins, and minerals that are often destroyed in traditional
            juicing methods. This means you get more nutrition in every sip.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
            Our Commitment
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>100% organic, locally-sourced ingredients</li>
            <li>No added sugars, preservatives, or artificial ingredients</li>
            <li>Sustainable packaging and delivery practices</li>
            <li>Supporting local farmers and our community</li>
          </ul>

          <div className="mt-12 bg-green-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mb-6">
              Explore our menu and start your juice journey today.
            </p>
            <Link href="/menu">
              <a className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                View Menu
              </a>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
