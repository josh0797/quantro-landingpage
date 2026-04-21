import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { staggerContainer } from "../lib/animations";

// Animated Section Wrapper - triggers entrance animations on scroll-in
export const AnimatedSection = ({ children, className = "", id = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;
