
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 18,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(2px)',
  },
};

const pageTransition = {
  duration: 0.35,
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
      }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
