import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({ message = "No items found", actionLabel, onAction }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center"
        >
            <div className="bg-white/5 p-6 rounded-full mb-4">
                <FolderOpen size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{message}</h3>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="mt-4 glass-btn px-6 py-2"
                >
                    {actionLabel}
                </button>
            )}
        </motion.div>
    );
};

export default EmptyState;
