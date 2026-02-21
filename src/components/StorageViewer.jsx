import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Trash2, Database } from 'lucide-react';
import { STORAGE_KEYS } from '../services/api';
import { Button } from './UI';

const StorageViewer = ({ isOpen, onClose }) => {
    const [data, setData] = useState({});

    const loadData = () => {
        const newData = {};
        Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
            try {
                const item = localStorage.getItem(storageKey);
                newData[key] = item ? JSON.parse(item) : null;
            } catch (e) {
                newData[key] = 'Error parsing JSON';
            }
        });
        setData(newData);
    };

    useEffect(() => {
        if (isOpen) loadData();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl flex flex-col border dark:border-gray-700">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <Database className="text-blue-600" />
                        <h2 className="text-xl font-bold dark:text-white">Local Storage Inspector</h2>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={loadData} size="sm"><RefreshCw size={16} /></Button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-6 bg-gray-50 dark:bg-gray-950/50">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 overflow-hidden">
                            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-center">
                                <span className="font-mono text-sm font-bold text-blue-700 dark:text-blue-400">{STORAGE_KEYS[key]}</span>
                                <span className="text-xs text-gray-500 uppercase">{key}</span>
                            </div>
                            <div className="p-0 overflow-x-auto">
                                <pre className="text-xs text-gray-700 dark:text-gray-300 p-4 font-mono">
                                    {JSON.stringify(value, null, 2)}
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-right">
                    <p className="text-xs text-gray-500">This data is stored only in your browser.</p>
                </div>
            </div>
        </div>
    );
};

export default StorageViewer;
