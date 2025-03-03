import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Stats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/stats', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token for authentication
                    },
                });
                setStats(response.data.stats);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Product Statistics</h1>
            <p>Total Products: {stats.totalProducts}</p>
            {/* Add more stats here */}
        </div>
    );
};

export default Stats;