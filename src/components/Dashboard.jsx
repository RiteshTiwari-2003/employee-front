import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Dashboard = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        WELCOME ADMIN PANEL
                    </h1>
                    <p className="text-xl text-gray-600">
                        Manage your employees efficiently
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
