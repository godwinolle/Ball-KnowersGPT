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
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50" onClick={ handleOverlayClick }>
            <div className="p-4 rounded-lg shadow-lg max-w-md w-full">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">
                    &times;
                </button>
                {children}
            </div>
        </div>
    )
}

export default ModalMenu