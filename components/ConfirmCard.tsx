

interface ConfirmCardProps{
    message: string;
    onConfirm: () => void;
    onClose: () => void;
    isLoading: boolean;
}

export default function ConfirmCard({message, onConfirm, onClose, isLoading}: ConfirmCardProps) {
    return(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="bg-background-light w-full min-h-[100px] max-w-[400px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
        
        <div className="relative p-4 border-b border-gray-700/50 flex justify-center items-center">
            <h2 className="text-xl px-3 font-bold text-text-main text-center">{message}</h2>
        </div>

        <div className="mt-auto flex justify-center items-center gap-3 p-5">
        <button
            disabled={isLoading}
            onClick={onClose}
            className="px-5 py-2 rounded-full w-35 font-semibold text-text-muted hover:bg-gray-800 transition-colors"
        >
            Cancelar
        </button>
        <button
            disabled={isLoading}
            onClick={onConfirm}
            className="px-6 py-2 rounded-full flex items-center justify-center w-35 font-bold text-white bg-primary hover:opacity-90 transition-opacity"
        >
            {isLoading ? (
                <svg className="spinner-svg" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
            ) : "Sim"}
        </button>
        </div>

    </div>
    </div>
    );
}