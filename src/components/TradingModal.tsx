'use client';

import { useState } from 'react';
import type { Prediction, TradingModalProps } from '@/types/types';

export const TradingModal = ({ isOpen, onClose, prediction, selectedOutcome, action }: TradingModalProps) => {
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>(action);
    const [amount, setAmount] = useState<string>('0');
    const [currency, setCurrency] = useState<string>('Dollars');

    if (!isOpen || !prediction) return null;

    const yesPrice = prediction.yesPrice || 0.042; // Default to 4.2¢ if not set
    const noPrice = prediction.noPrice || 0.959; // Default to 95.9¢ if not set

    const formatPrice = (price: number) => {
        if (price < 1) {
            return `${(price * 100).toFixed(1)}¢`;
        }
        return `$${price.toFixed(2)}`;
    };

    const handleTrade = () => {
        // TODO: Implement actual trading logic
        console.log('Trading:', { prediction, selectedOutcome, action: activeTab, amount });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-start space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        {prediction.category === 'politics' && <span className="text-2xl">🏛️</span>}
                        {prediction.category === 'entertainment' && <span className="text-2xl">🎤</span>}
                        {prediction.category === 'sports' && <span className="text-2xl">⚽</span>}
                        {prediction.category === 'token' && <span className="text-2xl">₿</span>}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                            {prediction.title}
                        </h3>
                        <p className="text-sm text-blue-600 mt-1">
                            {activeTab === 'buy' ? 'Buy' : 'Sell'} {selectedOutcome === 'yes' ? 'Yes' : 'No'}
                        </p>
                    </div>
                </div>

                {/* Buy/Sell Tabs */}
                <div className="flex space-x-1 mb-4">
                    <button
                        onClick={() => setActiveTab('buy')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'buy'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                            }`}
                    >
                        Buy
                    </button>
                    <button
                        onClick={() => setActiveTab('sell')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'sell'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                            }`}
                    >
                        Sell
                    </button>
                    <div className="ml-auto">
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                            <option value="Dollars">Dollars</option>
                            <option value="Contracts">Contracts</option>
                        </select>
                    </div>
                </div>

                {/* Yes/No Outcome Buttons */}
                <div className="space-y-2 mb-4">
                    <button
                        onClick={() => { }}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${selectedOutcome === 'yes'
                            ? 'bg-blue-500 text-white'
                            : 'bg-purple-100 text-purple-700'
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Yes</span>
                            <span className="font-bold">{formatPrice(yesPrice)}</span>
                        </div>
                    </button>
                    <button
                        onClick={() => { }}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${selectedOutcome === 'no'
                            ? 'bg-purple-500 text-white'
                            : 'bg-purple-100 text-purple-700'
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-medium">No</span>
                            <span className="font-bold">{formatPrice(noPrice)}</span>
                        </div>
                    </button>
                </div>

                {/* Amount Input */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Amount</label>
                        <span className="text-sm text-green-600">Earn 3.75% Interest</span>
                    </div>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="$0"
                        className="w-full p-3 border border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Sign up to trade button */}
                <button
                    onClick={handleTrade}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                    Sign up to trade
                </button>
            </div>
        </div>
    );
};
