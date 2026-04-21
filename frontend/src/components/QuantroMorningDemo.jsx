import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  Target, 
  Sparkles, 
  ChevronRight, 
  Check,
  TrendingDown,
  TrendingUp,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { demoStates, flowMessage } from '../data/demoData';

// Number animation component
const AnimatedNumber = ({ value, prefix = '', className = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    const start = displayValue;
    const end = value;
    const duration = 800;
    const startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + (end - start) * easeOutQuart);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  return (
    <span className={className}>
      {prefix}{displayValue >= 0 ? '+' : ''}{displayValue.toLocaleString()}
    </span>
  );
};

// Priority Badge Component
const PriorityBadge = ({ type, t }) => {
  const config = {
    urgent: { color: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-400', label: t('morning.urgent') },
    attention: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-400', label: t('morning.attention') },
    goal: { color: 'bg-[#00F5FF]/20 text-[#00F5FF] border-[#00F5FF]/30', dot: 'bg-[#00F5FF]', label: t('morning.goal') },
    progress: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-400', label: t('morning.progress') },
    success: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400', label: t('morning.success') },
    automated: { color: 'bg-[#00F5FF]/20 text-[#00F5FF] border-[#00F5FF]/30', dot: 'bg-[#00F5FF]', label: t('morning.automated') }
  };
  
  const { color, dot, label } = config[type] || config.goal;
  
  return (
    <div className={`flex items-center gap-2 ${color} px-2 py-0.5 rounded text-xs font-medium border`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </div>
  );
};

// Suggestion Item Component
const SuggestionItem = ({ suggestion, onExecute, t, tObj }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        suggestion.executed 
          ? 'bg-emerald-500/10 border border-emerald-500/30' 
          : 'bg-[#00F5FF]/5 border border-[#00F5FF]/10 hover:bg-[#00F5FF]/10 hover:border-[#00F5FF]/30'
      }`}
      onClick={() => !suggestion.executed && onExecute(suggestion.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: suggestion.executed ? 1 : 1.02, x: suggestion.executed ? 0 : 4 }}
      whileTap={{ scale: suggestion.executed ? 1 : 0.98 }}
    >
      <AnimatePresence mode="wait">
        {suggestion.executed ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
          >
            <Check className="text-white" size={12} />
          </motion.div>
        ) : (
          <motion.div key="arrow">
            <ChevronRight 
              className={`transition-colors ${isHovered ? 'text-[#00F5FF]' : 'text-slate-500'}`} 
              size={16} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <span className={`text-sm ${suggestion.executed ? 'text-emerald-400 line-through' : 'text-slate-300'}`}>
        {tObj(suggestion.text)}
      </span>
      
      {!suggestion.executed && isHovered && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-auto text-xs text-[#00F5FF]"
        >
          {t('morning.clickToExecute')}
        </motion.span>
      )}
      
      {suggestion.executed && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ml-auto text-xs text-emerald-400"
        >
          {t('morning.executed')} ✓
        </motion.span>
      )}
    </motion.div>
  );
};

// Main Demo Component
const QuantroMorningDemo = ({ mode = 'demo' }) => {
  const { t, tObj, language } = useLanguage();
  
  // State
  const [currentState, setCurrentState] = useState('initial');
  const [demoData, setDemoData] = useState(demoStates.initial);
  const [suggestions, setSuggestions] = useState(demoStates.initial.suggestions);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [showFlowMessage, setShowFlowMessage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle action button clicks
  const handleReduceCosts = useCallback(() => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      setCurrentState('afterCostReduction');
      setDemoData(demoStates.afterCostReduction);
      setInteractionCount(prev => prev + 1);
      setIsProcessing(false);
    }, 600);
  }, [isProcessing]);
  
  const handleIncreaseRevenue = useCallback(() => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      setCurrentState('afterRevenueIncrease');
      setDemoData(demoStates.afterRevenueIncrease);
      setInteractionCount(prev => prev + 1);
      setIsProcessing(false);
    }, 600);
  }, [isProcessing]);
  
  // Handle suggestion execution
  const handleExecuteSuggestion = useCallback((id) => {
    setSuggestions(prev => 
      prev.map(s => s.id === id ? { ...s, executed: true } : s)
    );
    setInteractionCount(prev => prev + 1);
  }, []);
  
  // Handle priority card click
  const handlePriorityClick = useCallback((id) => {
    setSelectedPriority(selectedPriority === id ? null : id);
  }, [selectedPriority]);
  
  // Check for automation trigger
  useEffect(() => {
    const executedCount = suggestions.filter(s => s.executed).length;
    
    if (interactionCount >= 3 || executedCount >= 2) {
      setTimeout(() => {
        setShowFlowMessage(true);
        setTimeout(() => {
          setCurrentState('automated');
          setDemoData(demoStates.automated);
          setSuggestions(prev => prev.map(s => ({ ...s, executed: true })));
        }, 2000);
      }, 500);
    }
  }, [interactionCount, suggestions]);
  
  // Get alert color classes
  const getAlertColors = () => {
    switch (demoData.riskColor) {
      case 'red':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
          icon: 'bg-red-500/20',
          iconColor: 'text-red-400'
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          icon: 'bg-amber-500/20',
          iconColor: 'text-amber-400'
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          icon: 'bg-emerald-500/20',
          iconColor: 'text-emerald-400'
        };
      case 'cyan':
        return {
          bg: 'bg-[#00F5FF]/10',
          border: 'border-[#00F5FF]/30',
          text: 'text-[#00F5FF]',
          icon: 'bg-[#00F5FF]/20',
          iconColor: 'text-[#00F5FF]'
        };
      default:
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
          icon: 'bg-red-500/20',
          iconColor: 'text-red-400'
        };
    }
  };
  
  const alertColors = getAlertColors();
  
  return (
    <div className="snapshot-window relative overflow-hidden">
      {/* Flow Message Overlay */}
      <AnimatePresence>
        {showFlowMessage && currentState !== 'automated' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#0A0F1C]/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="flex flex-col items-center gap-4 text-center px-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-2 border-[#00F5FF]/30 border-t-[#00F5FF] flex items-center justify-center"
              >
                <Zap className="text-[#00F5FF]" size={24} />
              </motion.div>
              <p className="text-xl font-medium text-white max-w-md">
                {flowMessage[language]}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Browser Bar */}
      <div className="snapshot-browser-bar">
        <div className="browser-dots">
          <div className="browser-dot bg-red-500" />
          <div className="browser-dot bg-yellow-500" />
          <div className="browser-dot bg-green-500" />
        </div>
        <div className="browser-url">
          app.quantroos.com/dashboard
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <motion.div 
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-slate-400">{t('morning.live')}</span>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="p-4 md:p-6 lg:p-8">
        {/* Alert Banner */}
        <motion.div 
          className={`${alertColors.bg} border ${alertColors.border} rounded-xl p-4 md:p-5 mb-6`}
          layout
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3 md:gap-4">
              <motion.div 
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${alertColors.icon} flex items-center justify-center flex-shrink-0`}
                animate={isProcessing ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {currentState === 'automated' ? (
                  <Zap className={alertColors.iconColor} size={20} />
                ) : demoData.revenue >= 0 ? (
                  <TrendingUp className={alertColors.iconColor} size={20} />
                ) : (
                  <AlertCircle className={alertColors.iconColor} size={20} />
                )}
              </motion.div>
              
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <motion.span 
                    className={`font-semibold ${alertColors.text}`}
                    key={tObj(demoData.alertTitle)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {tObj(demoData.alertTitle)}
                  </motion.span>
                  <span className="text-xs bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded">
                    {t('morning.aiDetected')}
                  </span>
                </div>
                <motion.p 
                  className="text-slate-300 text-sm md:text-base"
                  key={tObj(demoData.message)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {tObj(demoData.message)}
                </motion.p>
                <p className="text-slate-500 text-sm mt-1">
                  {t('morning.netIncome')}{' '}
                  <motion.span 
                    className={`font-mono font-medium ${
                      demoData.revenue >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    <AnimatedNumber value={demoData.revenue} prefix="$" />
                  </motion.span>
                </p>
              </div>
            </div>
            
            {/* Action Buttons - Only show if not automated */}
            {currentState !== 'automated' && (
              <div className="flex gap-2 w-full lg:w-auto">
                <motion.button
                  onClick={handleReduceCosts}
                  disabled={isProcessing || currentState === 'afterCostReduction'}
                  className={`flex-1 lg:flex-none px-4 py-2.5 text-sm rounded-lg font-medium transition-all ${
                    currentState === 'afterCostReduction'
                      ? 'bg-amber-500/30 border border-amber-500/50 text-amber-400 cursor-not-allowed'
                      : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                  }`}
                  whileHover={currentState !== 'afterCostReduction' ? { scale: 1.02 } : {}}
                  whileTap={currentState !== 'afterCostReduction' ? { scale: 0.98 } : {}}
                >
                  {currentState === 'afterCostReduction' ? '✓ ' : ''}{t('morning.reduceCosts')}
                </motion.button>
                <motion.button
                  onClick={handleIncreaseRevenue}
                  disabled={isProcessing || currentState === 'afterRevenueIncrease'}
                  className={`flex-1 lg:flex-none px-4 py-2.5 text-sm rounded-lg font-medium transition-all ${
                    currentState === 'afterRevenueIncrease'
                      ? 'bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 cursor-not-allowed'
                      : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'
                  }`}
                  whileHover={currentState !== 'afterRevenueIncrease' ? { scale: 1.02 } : {}}
                  whileTap={currentState !== 'afterRevenueIncrease' ? { scale: 0.98 } : {}}
                >
                  {currentState === 'afterRevenueIncrease' ? '✓ ' : ''}{t('morning.increaseRevenue')}
                </motion.button>
              </div>
            )}
            
            {/* Automated badge */}
            {currentState === 'automated' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-[#00F5FF]/20 border border-[#00F5FF]/30 rounded-lg"
              >
                <Zap className="text-[#00F5FF]" size={16} />
                <span className="text-[#00F5FF] font-medium text-sm">{t('morning.automated')}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Priority Cards */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Target className="text-[#00F5FF]" size={18} />
              {t('morning.priorities')}
            </h3>
            <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
              {(demoData.priorities || demoStates.initial.priorities).map((priority, i) => (
                <motion.div
                  key={priority.id}
                  className={`priority-card cursor-pointer ${
                    selectedPriority === priority.id ? 'ring-2 ring-[#00F5FF]/50' : ''
                  }`}
                  onClick={() => handlePriorityClick(priority.id)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <PriorityBadge type={priority.type} t={t} />
                  <motion.p 
                    className="text-white text-sm font-medium mt-3 mb-1"
                    key={tObj(priority.title)}
                  >
                    {tObj(priority.title)}
                  </motion.p>
                  <p className="text-slate-500 text-xs">
                    {tObj(priority.detail)}{' '}
                    {priority.value && (
                      <span className={`font-mono ${
                        priority.value.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {priority.value}
                      </span>
                    )}
                  </p>
                  
                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {selectedPriority === priority.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 pt-3 border-t border-slate-700/50"
                      >
                        <div className="flex items-center gap-2 text-xs text-[#00F5FF]">
                          <ArrowRight size={12} />
                          <span>{language === 'es' ? 'Ver detalles' : 'View details'}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* AI Suggestions */}
          <div>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Sparkles className="text-[#A020FF]" size={18} />
              {t('morning.suggestions')}
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, i) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <SuggestionItem
                    suggestion={suggestion}
                    onExecute={handleExecuteSuggestion}
                    t={t}
                    tObj={tObj}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantroMorningDemo;
