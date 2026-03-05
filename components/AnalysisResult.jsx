import { CheckCircle, AlertTriangle, XCircle, ChevronRight, Shield } from "lucide-react";

export default function AnalysisResult({ result }) {
    if (!result) return null;

    const { isScam, confidenceScore, explanation, preventionTips } = result;

    // Determine color and icon
    let bgColor = "bg-green-50";
    let borderColor = "border-green-300";
    let textColor = "text-green-800";
    let Icon = CheckCircle;
    let statusText = "Likely Safe";

    if (confidenceScore >= 80) {
        bgColor = "bg-red-50";
        borderColor = "border-red-300";
        textColor = "text-red-800";
        Icon = XCircle;
        statusText = "High Risk! Likely Scam";
    } else if (confidenceScore >= 40) {
        bgColor = "bg-yellow-50";
        borderColor = "border-yellow-300";
        textColor = "text-yellow-800";
        Icon = AlertTriangle;
        statusText = "Suspicious. Be Careful";
    }

    return (
        <div className={`w-full max-w-2xl mx-auto mt-8 p-6 md:p-8 rounded-2xl border-2 ${bgColor} ${borderColor} shadow-md`}>
            <div className="flex items-center gap-4 mb-5">
                <Icon className={`w-12 h-12 md:w-16 md:h-16 ${textColor}`} />
                <div>
                    <h2 className={`text-2xl md:text-3xl font-bold ${textColor}`}>
                        {statusText}
                    </h2>
                    <p className={`text-xl md:text-2xl font-bold mt-1 ${textColor}`}>
                        Scam Probability: {confidenceScore}%
                    </p>
                </div>
            </div>

            <div className="mt-4 bg-white p-5 md:p-6 rounded-xl border border-gray-200 shadow-sm text-gray-800">
                <p className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-700">
                    <ChevronRight className="w-6 h-6" /> Explanation
                </p>
                <div className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                    {explanation}
                </div>
            </div>

            {preventionTips && (
                <div className="mt-4 bg-blue-50 p-5 md:p-6 rounded-xl border border-blue-200 shadow-sm text-blue-900">
                    <p className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800">
                        <Shield className="w-6 h-6" /> မည်သို့ကာကွယ်မည်နည်း
                    </p>
                    <div className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                        {preventionTips}
                    </div>
                </div>
            )}
        </div>
    );
}
