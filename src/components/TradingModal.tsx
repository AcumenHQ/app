'use client';

import { useState, useEffect } from 'react';
import type { Prediction, TradingModalProps } from '@/types/types';

export const TradingModal = ({ isOpen, onClose, prediction, selectedOutcome, action }: TradingModalProps) => {
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>(action);
    const [amount, setAmount] = useState<string>('');
    const [currency, setCurrency] = useState<string>('Dollars');
    const [activeOutcome, setActiveOutcome] = useState<'yes' | 'no' | null>(selectedOutcome);

    // Update activeTab when action prop changes
    useEffect(() => {
        setActiveTab(action);
    }, [action]);

    // Update activeOutcome when selectedOutcome prop changes
    useEffect(() => {
        setActiveOutcome(selectedOutcome);
    }, [selectedOutcome]);

    // Handle click outside to close modal
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('modal-backdrop')) {
                onClose();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen || !prediction) return null;

    const yesPrice = prediction.yesPrice || 0.042;
    const noPrice = prediction.noPrice || 0.959;

    const formatPrice = (price: number) => {
        if (price < 1) {
            return `${(price * 100).toFixed(1)}¢`;
        }
        return `$${price.toFixed(2)}`;
    };

    const handleTrade = () => {
        console.log('Trading:', { prediction, selectedOutcome: activeOutcome, action: activeTab, amount });
        onClose();
    };

    const getOutcomeColor = (outcome: 'yes' | 'no', isActive: boolean) => {
        if (isActive) {
            return outcome === 'yes' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
        }
        return outcome === 'yes' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700';
    };

    const getHeaderText = () => {
        const outcomeText = activeOutcome === 'yes' ? 'Yes' : 'No';
        const actionText = activeTab === 'buy' ? 'Buy' : 'Sell';
        return `${actionText} ${outcomeText}`;
    };

    return (
        <div className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div
                className="bg-card rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl border border-border"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-muted rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                            {prediction.category === 'politics' && <span className="text-lg sm:text-2xl">🏛️</span>}
                            {prediction.category === 'entertainment' && <span className="text-lg sm:text-2xl">🎤</span>}
                            {prediction.category === 'sports' && <span className="text-lg sm:text-2xl">⚽</span>}
                            {prediction.category === 'token' && <span className="text-lg sm:text-2xl">₿</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-semibold text-card-foreground leading-tight mb-1 sm:mb-1.5 line-clamp-2">
                                {prediction.title}
                            </h3>
                            <p className={`text-xs sm:text-sm font-medium ${activeOutcome === 'yes' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {getHeaderText()}
                            </p>
                        </div>
                    </div>

                    {/* Buy/Sell Tabs */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2 mb-4">
                        <div className="flex gap-1 w-full sm:w-auto">
                            <button
                                onClick={() => setActiveTab('buy')}
                                className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${activeTab === 'buy'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                            >
                                Buy
                            </button>
                            <button
                                onClick={() => setActiveTab('sell')}
                                className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${activeTab === 'sell'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                            >
                                Sell
                            </button>
                        </div>
                        <div className="w-full sm:w-auto sm:ml-auto">
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full sm:w-auto px-3 py-2 border border-border rounded-lg text-xs sm:text-sm font-medium bg-card text-card-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                                <option value="Dollars">Dollars</option>
                                <option value="Contracts">Contracts</option>
                            </select>
                        </div>
                    </div>

                    {/* Yes/No Outcome Buttons - Only show in Buy mode */}
                    {activeTab === 'buy' && (
                        <div className="flex gap-2 mb-4 sm:mb-5">
                            <button
                                onClick={() => setActiveOutcome('yes')}
                                className={`flex-1 p-3 sm:p-3.5 rounded-lg sm:rounded-xl text-left transition-all border-2 ${activeOutcome === 'yes'
                                    ? getOutcomeColor('yes', true) + ' border-transparent'
                                    : getOutcomeColor('yes', false) + ' border-transparent hover:border-green-200'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-sm sm:text-base">Yes</span>
                                    <span className="font-bold text-sm sm:text-base">{formatPrice(yesPrice)}</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveOutcome('no')}
                                className={`flex-1 p-3 sm:p-3.5 rounded-lg sm:rounded-xl text-left transition-all border-2 ${activeOutcome === 'no'
                                    ? getOutcomeColor('no', true) + ' border-transparent'
                                    : getOutcomeColor('no', false) + ' border-transparent hover:border-red-200'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-sm sm:text-base">No</span>
                                    <span className="font-bold text-sm sm:text-base">{formatPrice(noPrice)}</span>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Amount Input */}
                    <div className="mb-4 sm:mb-5">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs sm:text-sm font-semibold text-card-foreground">Amount</label>
                            <span className="text-xs sm:text-sm font-medium text-green-600">Earn 3.75% Interest</span>
                        </div>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                    setAmount(val);
                                }
                            }}
                            placeholder="$0"
                            className="w-full p-3 sm:p-4 border border-border rounded-lg sm:rounded-xl text-lg sm:text-2xl font-semibold text-muted-foreground bg-card focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-muted-foreground/50"
                        />
                    </div>

                    {/* Sign up to trade button */}
                    <button
                        onClick={handleTrade}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg sm:rounded-xl transition-colors shadow-sm text-sm sm:text-base"
                    >
                        Sign up to trade
                    </button>
                </div>
            </div>
        </div>
    );
};