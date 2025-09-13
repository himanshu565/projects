import { useNavigate } from "react-router-dom";
import { FileText, Users, Cloud, Shield, Edit3, RefreshCw } from "lucide-react";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const signIn = () => {
    navigate("/signin");
  };

  const features = [
    { icon: FileText, title: "Smart Organization", desc: "Categorize and tag your files for instant access." },
    { icon: Edit3, title: "Built-in Editor", desc: "Edit markdown, plain text, and more directly in the app." },
    { icon: RefreshCw, title: "Version Control", desc: "Track changes and roll back anytime." },
    { icon: Users, title: "Collaboration", desc: "Share files, assign roles, and edit together in real-time." },
    { icon: Cloud, title: "Cloud Sync", desc: "Your files are always up-to-date across devices." },
    { icon: Shield, title: "Secure & Private", desc: "Enterprise-grade encryption keeps your files safe." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-2xl font-bold text-blue-600">TBD</div>
          <ul className="hidden md:flex space-x-8 font-medium">
            <li><a href="#features" className="hover:text-blue-600">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-blue-600">How It Works</a></li>
            <li><a href="#pricing" className="hover:text-blue-600">Pricing</a></li>
            <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
          </ul>
          <button
            onClick={signIn}
            className="ml-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-extrabold mb-6">Manage Text Files Smarter</h1>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Organize, edit, and collaborate on text files with ease.  
            Say goodbye to clutter and hello to productivity.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={signIn}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started
            </button>
            <a
              href="#features"
              className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl shadow-md p-6 text-center hover:shadow-lg transition"
              >
                <f.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-blue-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Upload Files", desc: "Drag and drop or import from cloud." },
              { step: "2", title: "Organize", desc: "AI tags and categorizes instantly." },
              { step: "3", title: "Collaborate", desc: "Invite your team and work together." },
              { step: "4", title: "Access Anywhere", desc: "Stay synced across devices." }
            ].map((s, i) => (
              <div key={i} className="bg-white shadow-md rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-3">{s.step}</div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 mt-12">
        <div className="container mx-auto text-center text-sm">
          <p>
            &copy; 2025 TBD. All rights reserved. |{" "}
            <a href="#" className="hover:text-white">Privacy Policy</a> |{" "}
            <a href="#" className="hover:text-white">Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  );
};
