import React from 'react';
import { GraduationCap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = ({ onNavigate }) => {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">LearnHub</span>
                    </div>

                    <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</button>
                        <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</button>
                        <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</button>
                        <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</button>
                    </div>

                    <div className="flex gap-4">
                        <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><Github size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><Linkedin size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><Mail size={20} /></a>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
                    © {new Date().getFullYear()} LearnHub Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
