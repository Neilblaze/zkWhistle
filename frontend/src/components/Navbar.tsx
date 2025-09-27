export const Navbar = () => {
  return (
    <nav className="bg-midnight-black border-b border-pure-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-pure-white font-outfit">
            zkWhistle
          </h1>

          <button className="bg-brand-blue hover:bg-brand-blue/80 text-pure-white font-medium px-6 py-2 rounded-lg font-outfit">
            Submit Report
          </button>
        </div>
      </div>
    </nav>
  );
};