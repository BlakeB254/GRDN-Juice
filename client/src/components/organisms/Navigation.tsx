import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();

  const navLinks = [
    { href: "/menu", label: "Menu" },
    { href: "/blend-builder", label: "Build Your Blend" },
    { href: "/about", label: "About" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/login", label: "Login" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors">
            Garden District Juice
          </Link>
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium ${
                  location === link.href
                    ? "text-green-600"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
