"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, Share2, UploadCloud, ShieldCheck, Zap, MousePointerSquareDashed, Link2, Download } from "lucide-react";

export default function page() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="flex items-center space-x-2">
            <Share2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">ShareIt</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            {session ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative text-center py-20 md:py-32 lg:py-40 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative container mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Share Files, Instantly & Securely.
            </h2>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-blue-100">
              The simplest and most elegant way to share your files with anyone, anywhere. Drag, drop, and share. It's that easy.
            </p>
            <Link href={session ? "/dashboard" : "/signup"}>
              <Button size="lg" className="mt-8 px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 transition-transform transform hover:scale-105">
                Get Started for Free <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto text-center px-4">
            <h3 className="text-3xl md:text-4xl font-bold">
              Why Choose ShareIt?
            </h3>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">We offer a feature-rich service that is designed for ease of use and security.</p>
            <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
              <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mt-4">Easy to Use</h4>
                <p className="mt-2 text-gray-600">
                  Drag and drop your files and get a shareable link instantly. No registration required for basic sharing.
                </p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mt-4">Secure & Private</h4>
                <p className="mt-2 text-gray-600">
                  Your files are encrypted in transit and at rest. You control who has access and for how long.
                </p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mt-4">Lightning Fast</h4>
                <p className="mt-2 text-gray-600">
                  Our global infrastructure ensures your files are uploaded and downloaded at blazing speeds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="container mx-auto text-center px-4">
            <h3 className="text-3xl md:text-4xl font-bold">How It Works in 3 Simple Steps</h3>
            <div className="grid md:grid-cols-3 gap-12 mt-12">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 bg-white border-2 border-blue-500 text-blue-500 rounded-full text-2xl font-bold">1</div>
                <MousePointerSquareDashed className="w-16 h-16 mt-6 text-gray-700" />
                <h4 className="text-xl font-bold mt-4">Upload Your File</h4>
                <p className="mt-2 text-gray-600">Drag and drop or select a file from your device.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 bg-white border-2 border-blue-500 text-blue-500 rounded-full text-2xl font-bold">2</div>
                <Link2 className="w-16 h-16 mt-6 text-gray-700" />
                <h4 className="text-xl font-bold mt-4">Get a Shareable Link</h4>
                <p className="mt-2 text-gray-600">We instantly generate a unique and secure link for your file.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 bg-white border-2 border-blue-500 text-blue-500 rounded-full text-2xl font-bold">3</div>
                <Download className="w-16 h-16 mt-6 text-gray-700" />
                <h4 className="text-xl font-bold mt-4">Share & Download</h4>
                <p className="mt-2 text-gray-600">Share the link with anyone. They can view or download the file.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* <section id="testimonials" className="py-20 bg-white">
          <div className="container mx-auto text-center px-4">
            <h3 className="text-3xl md:text-4xl font-bold">Loved by Users Worldwide</h3>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. Here's what our users have to say.</p>
            <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600">"ShareIt is a game-changer. I use it daily to share design mockups with my clients. It's fast, simple, and reliable."</p>
                <div className="flex items-center mt-4">
                  <img src="/placeholder-user.jpg" alt="User 1" className="w-12 h-12 rounded-full" />
                  <div className="ml-4">
                    <p className="font-bold">Sarah L.</p>
                    <p className="text-sm text-gray-500">Freelance Designer</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600">"The ability to set expiration times on links is a fantastic feature for sharing sensitive documents. Highly recommended!"</p>
                <div className="flex items-center mt-4">
                  <img src="/placeholder-user.jpg" alt="User 2" className="w-12 h-12 rounded-full" />
                  <div className="ml-4">
                    <p className="font-bold">Mark C.</p>
                    <p className="text-sm text-gray-500">Project Manager</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600">"I love the clean interface and the absence of ads. It's a pure file-sharing experience. The best I've used."</p>
                <div className="flex items-center mt-4">
                  <img src="/placeholder-user.jpg" alt="User 3" className="w-12 h-12 rounded-full" />
                  <div className="ml-4">
                    <p className="font-bold">James B.</p>
                    <p className="text-sm text-gray-500">Photographer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Final CTA Section */}
        <section className="bg-blue-600 text-white">
          <div className="container mx-auto text-center py-16 px-4">
            <h3 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h3>
            <p className="mt-2 text-blue-100 max-w-2xl mx-auto">Create an account to unlock more features like larger file uploads and longer expiration times.</p>
            <Link href={session ? "/dashboard" : "/signup"}>
              <Button size="lg" className="mt-8 px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 transition-transform transform hover:scale-105">
                Sign Up Now <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="p-8 bg-gray-800 text-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-lg">ShareIt</h4>
            <p className="mt-2 text-gray-400">Simple, fast, and secure file sharing.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg">Product</h4>
            <ul className="mt-2 space-y-2">
              <li><Link href="#features" className="text-gray-400 hover:text-white">Features</Link></li>
              <li><Link href="#how-it-works" className="text-gray-400 hover:text-white">How it Works</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg">Company</h4>
            <ul className="mt-2 space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg">Connect</h4>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white">GitHub</a>
            </div>
          </div>
        </div>
        <div className="container mx-auto text-center mt-8 border-t border-gray-700 pt-6">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} ShareIt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
