import { useState, useEffect, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CommandSeal from '../../CommandSeal.webp';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const ServantCard = memo(({ servant }) => {
    return (
        <div className={`p-2 rounded-lg relative ${servant.character.rarity === 5 ? 'bg-yellow-100 border border-yellow-400' :
            servant.character.rarity === 4 ? 'bg-purple-100 border border-purple-400' :
                'bg-blue-100 border border-blue-400'
            }`}>
                
            {/* Servant image */}
            <img
                src={servant.character.imageUrl || 'https://fgo.gamepress.gg/sites/default/files/2019-04/TutorialServants.png'}
                alt={servant.character.name}
                className="w-full h-auto rounded mb-2"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://fgo.gamepress.gg/sites/default/files/2019-04/TutorialServants.png';
                }}
            />
            <div className="text-center">
                <h4 className="font-bold text-sm">{servant.character.name}</h4>
                <p className="text-xs">{servant.character.class} • {servant.character.rarity}★</p>
                <p className="text-xs mt-1">Level: {servant.level || 1}</p>
            </div>
        </div>
    );
});

const Gacha = () => {
    const { user, updateUserData } = useAuth();
    const [pools, setPools] = useState([]);
    const [selectedPool, setSelectedPool] = useState(null);
    const [userServants, setUserServants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pullResult, setPullResult] = useState(null);
    const [pulling, setPulling] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Debug API URL
                console.log('API base URL:', API_BASE_URL);
                
                // Fetch pools
                const poolsResponse = await api.get('/pools');
                setPools(poolsResponse.data);

                // Fetch user's servants if user is logged in
                if (user && user.id) {
                    const servantsResponse = await api.get(`/users/${user.id}/servants`);
                    setUserServants(servantsResponse.data);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(`Failed to load data: ${err.message || 'Unknown error'}`);
                
                // More detailed logging
                if (err.response) {
                    // The request was made and the server responded with an error status
                    console.error('Response error:', err.response.status, err.response.data);
                } else if (err.request) {
                    // The request was made but no response was received
                    console.error('Request error - no response received:', err.request);
                } else {
                    // Something happened in setting up the request
                    console.error('Request setup error:', err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleSelectPool = (pool) => {
        setSelectedPool(pool);
        setPullResult(null);
    };

    const handlePull = async () => {
        if (!selectedPool || !user || pulling) return;

        setPulling(true);
        setShowAnimation(true);
        setError('');
        setPullResult(null);

        try {
            const response = await api.post('/gacha/pull', {
                userId: user.id,
                poolId: selectedPool._id
            });

            // Show animation for set time
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowAnimation(false);
            await new Promise(resolve => setTimeout(resolve, 200));

            const data = response.data;

            if (data.success && data.character) {
                // Calculate new currency
                const newCurrency = user.currency - selectedPool.cost;

                // Create new servant object
                const newServant = {
                    _id: `servant-${Date.now()}`,
                    obtainedAt: new Date().toISOString(),
                    level: 1,
                    character: data.character
                };

                updateUserData({ ...user, currency: newCurrency });
                setPullResult(data);
                setUserServants(prev => [...prev, newServant]);
            } else {
                setPullResult(data);
            }
        } catch (err) {
            console.error('Error during pull:', err);
            
            // Better error handling with axios
            if (err.response) {
                setError(`Pull failed: ${err.response.data.message || err.response.statusText}`);
            } else if (err.request) {
                setError('Network error: Could not connect to the server');
            } else {
                setError(`Error: ${err.message}`);
            }
            
            setShowAnimation(false);
        } finally {
            setPulling(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }

        try {
            await api.delete(`/users/${user.id}`);
            
            // Clear auth context/logout
            updateUserData(null);
            
            // Redirect to login page
            window.location.href = '/login';
        } catch (err) {
            console.error('Error deleting account:', err);
            
            if (err.response) {
                setError(`Account deletion failed: ${err.response.data.message || err.response.statusText}`);
            } else if (err.request) {
                setError('Network error: Could not connect to the server');
            } else {
                setError(`Error: ${err.message}`);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center w-full max-w-screen-xl">            <h1 className="text-5xl font-bold mb-8 text-center text-white">Gacha Summon</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Currency display and user info with delete account option */}
            <div className="bg-blue-900 bg-opacity-80 rounded-xl p-4 mb-8 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-white mb-4 md:mb-0">
                        <span className="font-bold">Welcome, {user.username}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <span className="font-bold">Saint Quartz:</span> {user.currency}
                        </div>

                        <button
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Summon Animation */}
            {showAnimation && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
                    <img
                        src={CommandSeal}
                        alt="Summon Animation"
                        className="h-64 w-64 animate-pulse"
                    />
                </div>
            )}

            {/* Pool Selection with Banner Images */}
            {pools.length === 0 ? (
                <div className="bg-white bg-opacity-90 p-6 rounded-lg mb-8 text-center">
                    <p className="text-gray-700">No active gacha pools available right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {pools.map((pool) => (
                        <div
                            key={pool._id}
                            onClick={() => handleSelectPool(pool)}
                            className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${selectedPool?._id === pool._id
                                ? 'bg-blue-700 text-white transform scale-105 shadow-lg'
                                : 'bg-white bg-opacity-80 text-gray-800 hover:bg-blue-100'
                                }`}
                        >
                            {/* Banner Image */}
                            <div className="mb-4 overflow-hidden rounded-lg">
                                <img
                                    src={pool.imageUrl || 'https://fgo.gamepress.gg/sites/default/files/2019-04/TutorialServants.png'}
                                    alt={`${pool.name} Banner`}
                                    className="w-full h-40 object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://fgo.gamepress.gg/sites/default/files/2019-04/TutorialServants.png';
                                    }}
                                />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{pool.name}</h3>
                            <p className={selectedPool?._id === pool._id ? 'text-blue-200' : 'text-gray-600'}>
                                {pool.description || 'Standard gacha pool'}
                            </p>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="font-bold">Cost: {pool.cost} SQ</span>
                                {selectedPool?._id === pool._id && (
                                    <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">Selected</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pull Options and Button */}
            <div className="flex flex-col items-center mb-12">
                {/* Pull Button */}
                <button
                    onClick={handlePull}
                    disabled={
                        !selectedPool ||
                        pulling ||
                        user.currency < (selectedPool?.cost || 0)
                    }
                    className={`px-8 py-4 text-2xl font-bold rounded-lg transition-all duration-300 ${!selectedPool || pulling || user.currency < (selectedPool?.cost || 0)
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1'
                        } text-white`}
                >
                    {pulling ? 'Summoning...' :
                        !selectedPool ? 'Select a Pool' :
                            user.currency < (selectedPool?.cost || 0) ? 'Insufficient SQ' :
                                `Pull 1 Servant`}
                </button>            </div>

            {/* Pull Result */}
            {pullResult && (
                <div className="mb-12 bg-white bg-opacity-90 p-6 rounded-lg shadow-xl max-w-md mx-auto"
                    style={{ minHeight: '300px', transition: 'all 0.3s ease' }}>
                    {pullResult ? (
                        <div className="flex flex-col items-center text-black">
                            <h3 className="text-2xl font-bold mb-4 text-center">{pullResult.message}</h3>

                            {pullResult.character && (
                                <>
                                    <div className={`p-1 rounded-lg mb-4 ${pullResult.character.rarity === 5 ? 'bg-yellow-400' :
                                        pullResult.character.rarity === 4 ? 'bg-purple-400' :
                                            'bg-blue-400'
                                        }`}>
                                        <img
                                            src={pullResult.character.imageUrl || 'https://fgo.gamepress.gg/sites/default/files/2019-04/TutorialServants.png'}
                                            alt={pullResult.character.name}
                                            className="w-48 h-auto rounded"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://fgo.gamepress.gg/sites/default/files/2019-04/TutorialServants.png';
                                            }}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-xl font-bold">{pullResult.character.name}</h4>
                                        <p>{pullResult.character.class} • {pullResult.character.rarity}★</p>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-gray-500">Select a pool and pull to see results</p>
                        </div>
                    )}
                </div>
            )}

            {/* User's Servants */}
            <div className="bg-white bg-opacity-90 p-6 rounded-lg text-black">
                <h2 className="text-3xl font-bold mb-6 text-center">Your Servants</h2>

                {userServants.length === 0 ? (
                    <p className="text-center text-gray-500">You don't have any servants yet. Pull the gacha to get some!</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {userServants.map((servant, index) => (
                            <ServantCard
                                key={servant._id || `servant-${servant.character._id}-${index}`}
                                servant={servant}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gacha;