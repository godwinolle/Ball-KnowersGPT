'use client'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

const ModalMenu = ({isOpen, onClose, children}: ModalProps) => {
    if (!isOpen) return null

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Prevent closing when clicking inside the modal content
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return(
        <div 
            className="fixed inset-0 bg-black/80 dark:bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200" 
            onClick={handleOverlayClick}
        >
            <div className="bg-gray-900 dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 dark:border-gray-600 animate-in zoom-in-95 duration-200 relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200"
                    aria-label="Close menu"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    )
}

export default ModalMenu