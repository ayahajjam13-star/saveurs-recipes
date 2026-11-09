
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 14,
    scale: 0.995,
    filter: 'blur(3px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.998,
    filter: 'blur(2px)',
  },
};

const pageTransition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1],
};

function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{
        width: '100%',
        minHeight: '100%',
        transformOrigin: 'center top',
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
