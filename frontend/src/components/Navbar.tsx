interface NavbarProps {
  title: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export const Navbar = ({ title, buttonText, onButtonClick }: NavbarProps) => {
  return (
    <nav className="bg-midnight-black border-b border-pure-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-pure-white font-outfit">
            {title}
          </h1>

          <button
            onClick={onButtonClick}
            className="bg-brand-blue hover:bg-brand-blue/80 text-pure-white font-medium px-6 py-2 rounded-lg font-outfit"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </nav>
  );
};