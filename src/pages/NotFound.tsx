
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center px-4">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center">
            <AlertTriangle size={48} className="text-verse-red" />
          </div>
        </div>
        <h1 className="text-6xl font-bold mb-4 font-mono text-white">404</h1>
        <p className="text-xl text-zinc-400 mb-8">
          The Verse script you're looking for doesn't exist
        </p>
        <Link to="/">
          <Button className="bg-verse-blue hover:bg-verse-blue/80 font-mono">
            <Home size={16} className="mr-2" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
