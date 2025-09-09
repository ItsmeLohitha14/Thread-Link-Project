import React from 'react';
import { Upload, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    const steps = [
        {
            id: 1,
            title: 'Upload Your Items',
            description:
                'Take a few photos and provide details about the clothing items you want to donate.',
            icon: <Upload className="h-8 w-8 text-teal-700" />,
            bg: 'bg-teal-100',
            dotColor: 'bg-teal-600',
        },
        {
            id: 2,
            title: 'Get Approved',
            description:
                'Our team reviews your submission to ensure it meets our community guidelines.',
            icon: <Clock className="h-8 w-8 text-yellow-700" />,
            bg: 'bg-yellow-100',
            dotColor: 'bg-yellow-500',
        },
        {
            id: 3,
            title: 'Make an Impact',
            description:
                'Your donations are matched with people in need, helping both the community and the environment.',
            icon: <Users className="h-8 w-8 text-orange-700" />,
            bg: 'bg-orange-100',
            dotColor: 'bg-orange-400',
        },
    ];

    return (
        <>
            {/* ABOUT SECTION */}
            <div id="about" className="bg-gray-50 py-24 px-4 md:px-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                    ThreadLink makes it easy to donate your gently used clothing to someone who needs it.
                    Follow these simple steps to make a difference.
                </p>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="relative bg-white shadow-md rounded-2xl px-6 py-8 flex flex-col items-center text-center space-y-4"
                        >
                            <div className={`rounded-full p-4 ${step.bg}`}>{step.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                            <p className="text-gray-600 text-sm">{step.description}</p>
                            <div
                                className={`absolute top-4 right-4 w-6 h-6 text-sm font-semibold text-white rounded-full flex items-center justify-center ${step.dotColor}`}
                            >
                                {step.id}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 mx-auto shadow">
                        Start Donating
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* BANNER SECTION */}
            <div className="bg-green-700 py-20 px-4 text-center text-white transition duration-300">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Make a Difference?
                </h2>
                <p className="text-base md:text-lg max-w-3xl mx-auto mb-8 text-gray-200">
                    Whether you have clothes to donate or are in need of clothing, ThreadLink is here to help.
                    Join our community today and be part of the sustainable fashion movement.
                </p>

                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <Link to="/donate">
                        <button className="bg-white text-green-600 hover:bg-gray-100 font-medium px-6 py-3 rounded-md shadow transition duration-200">
                            Donate Clothes
                        </button>
                    </Link>
                    <Link to="/items">
                        <button className="border border-white text-white hover:bg-white hover:text-green-700 font-medium px-6 py-3 rounded-md shadow transition duration-200">
                            Browse Available Items
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default About;
