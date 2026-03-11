import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold tracking-wider mr-4">
              GATE PREP
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hover:bg-blue-600 px-3 py-2 rounded-md transition-colors text-sm font-medium">
              Login
            </Link>
            <Link href="/register" className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors text-sm font-medium">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
