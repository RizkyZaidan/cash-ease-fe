"use client";

import { motion } from 'framer-motion';

const AnimatedLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedLayout;
