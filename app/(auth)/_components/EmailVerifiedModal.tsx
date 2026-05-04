import { X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmailVerifiedModalProps {
  onClose: () => void;
}

export default function EmailVerifiedModal({ onClose }: EmailVerifiedModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 animate-[scale-in_0.2s_ease-out]">

                <Button
                    onClick={onClose}
                    variant="ghost"
                    className="absolute top-6 right-6 text-gray-400 hover:text-emerald-600 transition-colors"
                >
                    <X className="w-8 h-8" />
                </Button>

                <div className="text-center space-y-8">
                    <div className="flex items-center justify-center gap-4">

                        <div className="flex-shrink-0">
                            <CheckCircle2 className="w-16 h-16 text-emerald-600" strokeWidth={2.5} />
                        </div>

                        <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed text-left font-semibold">
                            Your email has been verified!<br />
                            <span className="text-base font-normal text-gray-600">
                                You can now log in to your account
                            </span>
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={onClose}
                            className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Log In
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}