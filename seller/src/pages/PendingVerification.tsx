import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Smartphone } from 'lucide-react';

const PendingVerification: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Clock className="w-10 h-10 text-yellow-600" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">Verification Pending</h1>
                    <p className="text-gray-500">
                        Thanks for submitting your details. Our team is currently reviewing your application.
                    </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-left space-y-3">
                    <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Documents Submitted Successfully</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Admin Review in Progress (24-48 hrs)</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <Smartphone className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">You will receive an email once approved.</p>
                    </div>
                </div>

                <Link to="/" className="block w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default PendingVerification;
