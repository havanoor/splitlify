import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getSession } from "~/lib/helperFunctions";
import { getData } from "~/lib/ApiRequests";
import { Button } from "components/ui/button";
import { twMerge } from "tailwind-merge";
import {
  MdOutlineLibraryBooks,
  MdAttachMoney,
  MdGroup,
  MdArrowForward
} from "react-icons/md";

export const meta: MetaFunction = () => {
  return [
    { title: "Splitlify - Manage Finances Together" },
    { name: "description", content: "Simplify your group expenses and personal finances with Splitlify." },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, refreshToken } = await getSession(request);
  const headers = new Headers();

  if (!user) {
    return json({ user: null, recentBooks: null }, { headers });
  }

  try {
    const data = await getData(
      `book/?user_id=${user.user_id}&limit=3&offset=0`,
      user.token,
      refreshToken,
      headers,
      user
    );
    return json({ user, recentBooks: data || [] }, { headers });
  } catch (error) {
    return json({ user, recentBooks: [] }, { headers });
  }
}

export default function Index() {
  const { user, recentBooks } = useLoaderData<typeof loader>();

  return user ? (
    <Dashboard user={user} recentBooks={recentBooks} />
  ) : (
    <LandingPage />
  );
}

function Dashboard({ user, recentBooks }: { user: any, recentBooks: any[] }) {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, {user.first_name || user.email?.split("@")[0] || "User"}! 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Here's what's happening with your finances today.
          </p>
        </header>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl">
              <MdOutlineLibraryBooks />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Books</p>
              <h3 className="text-2xl font-bold text-gray-900">{recentBooks?.length || 0}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl">
              <MdAttachMoney />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <h3 className="text-2xl font-bold text-gray-900">--</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl">
              <MdGroup />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Groups</p>
              <h3 className="text-2xl font-bold text-gray-900">--</h3>
            </div>
          </div>
        </div>

        {/* Recent Books */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Recent Books</h2>
          <Button variant="ghost" asChild className="text-[#79AC78] hover:text-[#639362] hover:bg-green-50">
            <Link to="/books" className="flex items-center gap-2">
              View all <MdArrowForward />
            </Link>
          </Button>
        </div>

        {recentBooks && recentBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBooks.map((book: any) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#79AC78]/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={twMerge(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm",
                    book.type_of_book?.toLowerCase().includes("business") ? "bg-blue-100 text-blue-600" :
                      book.type_of_book?.toLowerCase().includes("personal") ? "bg-green-100 text-[#79AC78]" :
                        "bg-orange-100 text-orange-600"
                  )}>
                    {book.type_of_book?.toLowerCase().includes("business") ? "💼" :
                      book.type_of_book?.toLowerCase().includes("personal") ? "👤" : "🏷️"}
                  </div>
                  <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-500/10 uppercase tracking-widest">
                    {book.type_of_book}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-[#79AC78] transition-colors">
                  {book.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-500 mb-6">Create your first book to start tracking expenses.</p>
            <Button asChild className="bg-[#79AC78] hover:bg-[#639362] rounded-full">
              <Link to="/books">Go to Books</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#79AC78]/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#79AC78]/20 rounded-full blur-3xl opacity-50 mix-blend-multiply border border-transparent"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-3xl opacity-50 mix-blend-multiply border border-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
            Simplify Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#79AC78] to-[#639362]">
              Group Expenses
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
            The easiest way to track shared expenses, split bills, and settle debts with roommates, travelers, and friends. No more spreadsheet headaches.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg font-semibold bg-[#79AC78] hover:bg-[#639362] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 w-full sm:w-auto">
              <Link to="/register">Get Started for Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold rounded-full w-full sm:w-auto hover:bg-gray-50">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to manage finances</h2>
            <p className="text-lg text-gray-600">Powerful features wrapped in an intuitive interface.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                📚
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Book Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Organize your expenses into dedicated books for different trips, households, or projects. Keep everything neatly separated.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 text-[#79AC78] rounded-2xl flex items-center justify-center text-2xl mb-6">
                ✂️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Splitting</h3>
              <p className="text-gray-600 leading-relaxed">
                Easily split transactions equally, by exact amounts, or by percentages. The app handles the complex math for you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                🤝
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Share with Friends</h3>
              <p className="text-gray-600 leading-relaxed">
                Invite others to collaborate on books. Everyone can see their balances and add their own transactions in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Splitlify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
