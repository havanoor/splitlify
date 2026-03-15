import type { MetaFunction } from "@remix-run/node";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
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
  const session = await getSession(request);
  const user = session?.user;
  const refreshToken = session?.refreshToken;
  const headers = new Headers();


  if (!user) {
    throw redirect("/login");
  }

  try {
    const data = await getData(
      `book/?user_id=${user.user_id}&limit=3&offset=0`,
      user.token,
      refreshToken,
      headers,
      user
    );

    return json({ user, recentBooks: data && Array.isArray(data) ? data : [] }, { headers });
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
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Welcome back, {user.first_name || user.email?.split("@")[0] || "User"}! 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's what's happening with your finances today.
          </p>
        </header>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-info/20 text-info rounded-full flex items-center justify-center text-xl">
              <MdOutlineLibraryBooks />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Books</p>
              <h3 className="text-2xl font-bold text-foreground">{recentBooks?.length || 0}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-success/20 text-success rounded-full flex items-center justify-center text-xl">
              <MdAttachMoney />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
              <h3 className="text-2xl font-bold text-foreground">--</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-warning/20 text-warning rounded-full flex items-center justify-center text-xl">
              <MdGroup />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Groups</p>
              <h3 className="text-2xl font-bold text-foreground">--</h3>
            </div>
          </div>
        </div>

        {/* Recent Books */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Recent Books</h2>
          <Button variant="ghost" asChild className="text-primary hover:text-primary/90 hover:bg-success/20">
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
                className="group relative flex flex-col bg-white rounded-2xl border border-border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={twMerge(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm",
                    book.type_of_book?.toLowerCase().includes("business") ? "bg-info/20 text-info" :
                      book.type_of_book?.toLowerCase().includes("personal") ? "bg-success/20 text-primary" :
                        "bg-warning/20 text-warning"
                  )}>
                    {book.type_of_book?.toLowerCase().includes("business") ? "💼" :
                      book.type_of_book?.toLowerCase().includes("personal") ? "👤" : "🏷️"}
                  </div>
                  <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-muted-foreground ring-1 ring-inset ring-muted-foreground/10 uppercase tracking-widest">
                    {book.type_of_book}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {book.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-dashed border-input p-12 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">No books found</h3>
            <p className="text-muted-foreground mb-6">Create your first book to start tracking expenses.</p>
            <Button asChild className="bg-primary hover:bg-primary/90 rounded-full">
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
    <div className="min-h-screen bg-white selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply border border-transparent"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-info/20 rounded-full blur-3xl opacity-50 mix-blend-multiply border border-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-8">
            Simplify Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/90">
              Group Expenses
            </span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10">
            The easiest way to track shared expenses, split bills, and settle debts with roommates, travelers, and friends. No more spreadsheet headaches.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 w-full sm:w-auto">
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything you need to manage finances</h2>
            <p className="text-lg text-muted-foreground">Powerful features wrapped in an intuitive interface.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-info/20 text-info rounded-2xl flex items-center justify-center text-2xl mb-6">
                📚
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Book Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Organize your expenses into dedicated books for different trips, households, or projects. Keep everything neatly separated.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-success/20 text-primary rounded-2xl flex items-center justify-center text-2xl mb-6">
                ✂️
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Smart Splitting</h3>
              <p className="text-muted-foreground leading-relaxed">
                Easily split transactions equally, by exact amounts, or by percentages. The app handles the complex math for you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-warning/20 text-warning rounded-2xl flex items-center justify-center text-2xl mb-6">
                🤝
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Share with Friends</h3>
              <p className="text-muted-foreground leading-relaxed">
                Invite others to collaborate on books. Everyone can see their balances and add their own transactions in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Splitlify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
