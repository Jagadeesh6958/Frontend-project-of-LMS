import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, onNavigate }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-200 flex flex-col">
            <Navbar onNavigate={onNavigate} />
            <main className="flex-grow animate-fade-in">
                {children}
            </main>
            <Footer onNavigate={onNavigate} />
        </div>
    );
};

export default Layout;
