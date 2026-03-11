import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 tracking-tight leading-tight mb-6 animate-fade-in-up">
            Master the GATE with Realistic CBT Mocks
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed font-light">
            Practice on an interface identical to the actual exam. Secure your rank with detailed question-wise analysis and accurate scoring.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-lg font-bold shadow-lg shadow-blue-500/30 transform hover:-translate-y-1 transition duration-200"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-blue-800 border-2 border-blue-200 rounded-lg text-lg font-bold shadow-sm transition duration-200"
            >
              Candidate Login
            </Link>
          </div>
        </div>

        {/* Feature Highlights section */}
        <div className="mt-24 grid md:grid-cols-3 gap-10 max-w-5xl text-left">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex justify-center items-center text-2xl mb-6">⏱️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Exact GATE Interface</h3>
            <p className="text-gray-600">Familiarize yourself with the palette, timer, and navigation identical to the TCS iON platform used in GATE.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-lg flex justify-center items-center text-2xl mb-6">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">In-Depth Analysis</h3>
            <p className="text-gray-600">Get an instant scorecard post-submission detailing correct, wrong, and unattempted metrics to focus your prep.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-lg flex justify-center items-center text-2xl mb-6">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Stable</h3>
            <p className="text-gray-600">Experience robust mock tests with auto-submit on timeout and state persistence if you accidentally refresh.</p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 text-center border-t border-gray-800">
        <p>&copy; {new Date().getFullYear()} GATE PREP Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
