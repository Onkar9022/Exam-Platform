"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TestMeta {
  _id: string;
  testId: string;
  title: string;
  duration: number;
  totalQuestions: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [tests, setTests] = useState<TestMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth implicitly - if the API call below fails due to auth or if we want to add an auth check API
    // The tests API is public right now, but let's fetch it
    fetch("/api/tests/getTests")
      .then((res) => res.json())
      .then((data) => {
        if (data.tests) setTests(data.tests);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    // Basic logout by expiring cookie via a simple route or document.cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold tracking-wider">GATE PREP - DASHBOARD</div>
            <button onClick={handleLogout} className="hover:bg-blue-600 px-4 py-2 rounded transition">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Available Mock Tests</h1>
          <button
            onClick={() => fetch("/api/tests/seed").then(() => window.location.reload())}
            className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
          >
            Seed Tests (Dev Only)
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading mock tests...</div>
        ) : tests.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No mock tests found. Click &quot;Seed Tests&quot; to generate them.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {tests.map((test) => (
              <div key={test.testId} className="bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-col">
                <h3 className="text-lg font-bold text-blue-900 mb-2">{test.title}</h3>
                <div className="text-sm text-gray-600 mb-6 space-y-1">
                  <p><strong>Test ID:</strong> {test.testId}</p>
                  <p><strong>Duration:</strong> {test.duration} minutes</p>
                  <p><strong>Questions:</strong> {test.totalQuestions}</p>
                </div>
                <div className="mt-auto">
                  <Link
                    href={`/exam/${test.testId}`}
                    className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
                  >
                    Start Test
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
