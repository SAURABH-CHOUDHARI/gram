import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash'; // Lodash for debouncing
import Icons from '../assets/Icons';
import AppDock from '../components/AppDock';

const Search = () => {
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    
    const fetchProfiles = async (query) => {
        if (!query.trim()) {
            setResults([]); 
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`https://gram-ks17.onrender.com/users/search?query=${query}`,{
                headers :{
                    Authorization : `Bearer ${localStorage.getItem("token")}`
                }
            });
            setResults(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
        setLoading(false);
    };

    
    const debouncedSearch = useCallback(_.debounce(fetchProfiles, 500), []);

    useEffect(() => {
        debouncedSearch(searchText);
        return () => debouncedSearch.cancel(); 
    }, [searchText]);

    

    return (
        <div className='h-screen w-full bg-black flex justify-center py-3'>
            <div className='w-96  rounded-lg overflow-hidden border-zinc-800 border'>
                <img src={Icons.Search} alt="" className='h-10 w-10 absolute' />
                
                {/* Search Input */}
                <form className='p-2 w-full border-2 rounded-lg border-white caret-gray-100 text-gray-100'>
                    <input
                        type="text"
                        className='w-full outline-none px-8'
                        placeholder="Search profiles..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </form>

                {/* Search Results */}
                <div className='max-h-96 mt-2 overflow-auto'
                onClick={(e) => navigate(`/profile/${e.target.id}`)}
                >
                    {loading && <p className="text-gray-400 text-center">Loading...</p>}
                    
                    {!loading && results.length === 0 && searchText && (
                        <p className="text-gray-500 text-center">No results found</p>
                    )}

                    {results.map((user,index) => (
                        <div key={index} className='w-full mt-1 rounded-lg p-2 flex justify-between items-center border border-gray-500'>
                            <div className='flex gap-4 items-center text-gray-100'>
                                <img src={user.profileImage} alt="" className='h-15 w-15 object-center rounded-full' />
                                <h4 className='text-xl'>{user.username}</h4>
                            </div>
                            <button id={user.username} className='h-full bg-purple-700 text-zinc-200 font-bold w-20 p-2 rounded-lg border border-zinc-800'>
                                view
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <AppDock/>
        </div>
    );
};

export default Search;
