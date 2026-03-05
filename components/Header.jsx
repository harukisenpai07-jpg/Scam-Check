import { ShieldCheck } from "lucide-react";

export default function Header() {
    return (
        <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10 w-full">
            <div className="max-w-3xl mx-auto flex items-center justify-center space-x-3">
                <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Scam or Legit?
                </h1>
            </div>
        </header>
    );
}
