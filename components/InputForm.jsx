import { useState } from "react";
import { ClipboardPaste, Trash2, Send } from "lucide-react";

export default function InputForm({ onSubmit, isPending }) {
    const [textVal, setTextVal] = useState("");

    const handlePaste = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            setTextVal((prev) => prev + " " + clipboardText);
        } catch (err) {
            console.error("Failed to read clipboard contents: ", err);
            // Fallback for older browsers
        }
    };

    const handleClear = () => {
        setTextVal("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (textVal.trim()) {
            onSubmit(textVal);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-lg border border-gray-100 mt-6">
            <label htmlFor="message-input" className="block text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                Paste message or link here:
            </label>

            <div className="relative">
                <textarea
                    id="message-input"
                    value={textVal}
                    onChange={(e) => setTextVal(e.target.value)}
                    placeholder="e.g. URGENT: Your account is locked! Click here: http://bit.ly/123"
                    className="w-full p-4 md:p-6 text-lg md:text-xl border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-500 min-h-[160px] md:min-h-[200px]"
                    disabled={isPending}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                    type="button"
                    onClick={handlePaste}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-lg md:text-xl font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-300"
                    disabled={isPending}
                >
                    <ClipboardPaste className="w-6 h-6" />
                    Paste
                </button>

                <button
                    type="button"
                    onClick={handleClear}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-lg md:text-xl font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 border border-red-200"
                    disabled={isPending || !textVal}
                >
                    <Trash2 className="w-6 h-6" />
                    Clear
                </button>
            </div>

            <button
                type="submit"
                disabled={isPending || !textVal.trim()}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xl md:text-2xl font-bold py-4 md:py-5 px-8 rounded-lg transition-transform transform hover:scale-[1.02] shadow-md flex items-center justify-center gap-3"
            >
                {isPending ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                ) : (
                    <>
                        <Send className="w-7 h-7" />
                        Check if this is a Scam
                    </>
                )}
            </button>
        </form>
    );
}
