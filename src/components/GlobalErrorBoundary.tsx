'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // In background, we could attempt reconnection/reload logic here
    setTimeout(() => {
      // Attempt automatic recovery after 10s
      this.setState({ hasError: false });
    }, 10000);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030303] p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Spring physics-like easing
            className="max-w-md w-full p-10 rounded-2xl bg-[#0A0A0A] border box-shadow-[inset_0_0_0_1px_rgba(212,175,55,0.1)] relative overflow-hidden"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(212, 175, 55, 0.1)' }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
            <h2 className="text-[#D4AF37] font-serif text-2xl mb-6">The Void</h2>
            <p className="text-[#EAEAEA] font-light leading-[1.8] mb-8 text-lg font-serif italic">
              "The universe is change; our life is what our thoughts make it. This connection too, shall pass, but the mind remains sovereign."
            </p>
            <div className="flex items-center space-x-3 text-[#888888] text-sm uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>Seeking reconnection...</span>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

