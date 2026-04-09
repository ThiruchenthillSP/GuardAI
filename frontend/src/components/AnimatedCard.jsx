import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: delay, 
        ease: [0.33, 1, 0.68, 1] 
      }}
      className={`card ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
