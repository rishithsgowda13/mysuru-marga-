import React from 'react';
import { Home, Compass, Map, Heart } from 'lucide-react';
import { Sparkles, Palette, Utensils, MapPin, Landmark, TreePine } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Calendar, MapPin, Tag, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import Categories from './Categories';
import PlaceCard from './PlaceCard';
import { Search } from 'lucide-react';
import { Heart, MapPin, Star } from 'lucide-react';
import { featuredPlaces } from '../data';
import { Send, MessageSquare, Star } from 'lucide-react';
import { Search, Compass, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Navigation, Car, MapPin, Star, Clock, X, ChevronRight } from 'lucide-react';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { User, Home, Compass, Map, Heart } from 'lucide-react';
import { ChevronLeft, Share2, Heart, MapPin, Clock, IndianRupee, Star, Navigation, Check, MessageSquare, Car } from 'lucide-react';
import FeedbackSection from './FeedbackSection';
import { Heart } from 'lucide-react';

export const BottomNavItem = ({ icon: _Icon, label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${active ? 'text-mysore-700 scale-110' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
        >
            <_Icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-bold">{label}</span>
            {active && <div className="w-1 h-1 bg-mysore-600 rounded-full absolute bottom-2"></div>}
        </button>
    );
};

export const BottomNav = ({ activeTab, setActiveTab }) => {
    return (
        <div className="w-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-t border-white/20 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] h-24 pb-6 md:pb-2 z-50 shrink-0 transition-colors duration-200 rounded-t-[2rem]">
            <div className="flex justify-around items-center h-full px-2">
                <BottomNavItem
                    icon={Home}
                    label="Home"
                    active={activeTab === 'home'}
                    onClick={() => setActiveTab('home')}
                />
                <BottomNavItem
                    icon={Compass}
                    label="Explore"
                    active={activeTab === 'explore'}
                    onClick={() => setActiveTab('explore')}
                />
                <BottomNavItem
                    icon={Map}
                    label="Map"
                    active={activeTab === 'map'}
                    onClick={() => setActiveTab('map')}
                />
                <BottomNavItem
                    icon={Heart}
                    label="Saved"
                    active={activeTab === 'saved'}
                    onClick={() => setActiveTab('saved')}
                />

            </div>
        </div>
    );
};


export const CategoryItem = ({ icon: _Icon, label, color, bgColor }) => (
    <div className="flex flex-col items-center gap-3 min-w-[80px] group cursor-pointer">
        <div className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
            <_Icon className={`w-7 h-7 ${color}`} />
        </div>
        <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 text-center tracking-tight group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
    </div>
);

export const Categories = ({ onSeeAllClick }) => {
    const categories = [
        { icon: Sparkles, label: "Hidden Gems", color: "text-mysore-600 dark:text-mysore-400", bgColor: "bg-mysore-100 dark:bg-mysore-900/20" },
        { icon: Palette, label: "Artisans", color: "text-rose-600 dark:text-rose-400", bgColor: "bg-rose-50 dark:bg-rose-900/20" },
        { icon: Utensils, label: "Food", color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-900/20" },
        { icon: MapPin, label: "Near You", color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-50 dark:bg-purple-900/20" },
        { icon: Landmark, label: "Heritage", color: "text-amber-700 dark:text-amber-500", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
        { icon: TreePine, label: "Nature", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/20" },
    ];

    return (
        <div className="py-6 transition-colors duration-200">
            <div className="flex justify-between items-center px-6 mb-4">
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Browse Categories</h3>
                <button
                    onClick={onSeeAllClick}
                    className="text-mysore-700 text-xs font-bold hover:text-mysore-800 dark:hover:text-mysore-300 uppercase tracking-widest px-3 py-1 bg-mysore-100 dark:bg-mysore-900/30 rounded-full transition-colors"
                >
                    View All
                </button>
            </div>

            <div className="flex overflow-x-auto gap-4 px-6 pb-4 custom-scrollbar snap-x md:grid md:grid-cols-6 md:px-0 md:justify-items-center md:pb-0 md:overflow-visible md:gap-8">
                {categories.map((cat, index) => (
                    <CategoryItem key={index} {...cat} />
                ))}
            </div>
        </div>
    );
};


export const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I\'m your Mysuru travel assistant. Ask me anything about places to visit, local culture, food recommendations, or travel tips! ðŸŒŸ'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        // Add user message to chat
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Call our secure backend API instead of OpenAI directly
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: newMessages
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Chat API Error:', errorData);
                throw new Error(errorData.error || 'Failed to get response from ChatGPT');
            }

            const data = await response.json();
            const assistantMessage = data.message;

            setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
        } catch (error) {
            console.error('ChatGPT Error:', error);

            // More detailed error message
            let errorMessage = 'âš ï¸ Sorry, I encountered an error. ';

            if (error.message.includes('Incorrect API key')) {
                errorMessage += 'Your OpenAI API key appears to be invalid. Please check your .env file.';
            } else if (error.message.includes('quota')) {
                errorMessage += 'You have exceeded your OpenAI API quota. Please check your billing settings.';
            } else if (error.message.includes('rate_limit')) {
                errorMessage += 'Rate limit exceeded. Please wait a moment and try again.';
            } else {
                errorMessage += `Error: ${error.message}. Please make sure your OpenAI API key is configured correctly in the .env file.`;
            }

            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: errorMessage
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-[9999] w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
                    aria-label="Open chat"
                >
                    <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-[9999] w-[380px] h-[600px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Mysuru Assistant</h3>
                                <p className="text-white/80 text-[10px]">Powered by ChatGPT</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                        ? 'bg-[#D4AF37] text-white'
                                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                                        }`}
                                >
                                    <p
                                        className="text-sm leading-relaxed whitespace-pre-wrap"
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(message.content, {
                                                ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
                                                ALLOWED_ATTR: []
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3">
                                    <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={inputRef}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about Mysuru..."
                                className="flex-1 resize-none bg-gray-100 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 max-h-24"
                                rows="1"
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className="w-10 h-10 bg-[#D4AF37] hover:bg-[#B8941F] disabled:bg-gray-300 dark:disabled:bg-gray-700 rounded-full flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5 text-white" />
                            </button>
                        </div>
                        <p className="text-[9px] text-gray-400 mt-2 text-center">
                            AI responses may vary. Always verify travel information.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};


export const EventCard = ({ event }) => (
    <div className="flex-shrink-0 w-72 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
        <div className="relative h-40 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <img
                src={event.image || `https://images.unsplash.com/photo-1590740608759-6799516ca4d0?auto=format&fit=crop&q=80&w=400`}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                    {event.event_type || event.type}
                </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-20">
                <h4 className="text-white font-serif text-lg leading-tight line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                    {event.title}
                </h4>
            </div>
        </div>
        <div className="p-5 space-y-4">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#D4AF37]" />
                    <span>{new Date(event.event_date || event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Tag size={14} className="text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">{event.price || 'Free'}</span>
                </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {event.description}
            </p>

            <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                    <MapPin size={14} />
                    <span className="truncate max-w-[120px]">{event.spot_name}</span>
                </div>
                <button className="p-2 bg-gray-50 dark:bg-gray-700 rounded-xl group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                    <ArrowRight size={14} />
                </button>
            </div>
        </div>
    </div>
);

export const EventsSection = ({ events = [] }) => {
    if (events.length === 0) return null;

    return (
        <div className="py-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex justify-between items-center px-5 mb-6">
                <div>
                    <h3 className="text-2xl font-serif text-gray-900 dark:text-white">Upcoming Events</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mt-1">Heritage festivals & workshops</p>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] transition-colors">
                    View All
                </button>
            </div>

            <div className="flex space-x-5 overflow-x-auto px-5 pb-6 custom-scrollbar scroll-smooth">
                {events.map((event, index) => (
                    <EventCard key={event.id || index} event={event} />
                ))}
            </div>
        </div>
    );
};


export const Explore = ({ places, onCardClick, savedPlaceIds = [], onToggleSave }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPlaces = places.filter(place =>
        place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="pb-20">
            <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 px-4 py-3 border-b border-gray-100 dark:border-gray-800 transition-colors">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search hidden gems, artisans, food..."
                        className="w-full bg-gray-100 dark:bg-gray-800 rounded-full py-2 pl-10 pr-4 text-sm dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                    />
                </div>
            </div>

            <Categories />

            <div className="px-4 py-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {searchQuery ? `Search Results (${filteredPlaces.length})` : 'All Experiences'}
                </h3>
                {filteredPlaces.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredPlaces.map(place => (
                            <PlaceCard
                                key={place.id}
                                {...place}
                                onClick={() => onCardClick(place)}
                                isSaved={savedPlaceIds.includes(place.id)}
                                onToggleSave={(e) => onToggleSave(e, place.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        No places found matching "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
};

export const FeaturedCard = ({ place, onClick, isSaved, onToggleSave }) => (
    <div
        onClick={() => onClick(place)}
        className="flex-shrink-0 w-64 md:w-full bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] scale-100 hover:scale-[1.02] transition-all duration-500 ease-out group cursor-pointer relative"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(place);
            }
        }}
    >
        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4 z-20">
            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-gray-100 dark:border-gray-800">
                <span className={`text-[10px] font-black uppercase tracking-widest ${place.categoryColor?.replace('bg-', 'text-') || 'text-amber-600'}`}>
                    {place.category}
                </span>
            </div>
        </div>

        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gray-900 animate-pulse -z-10" />
            <img
                src={place.image}
                alt={place.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Save Button */}
            <button
                onClick={(e) => onToggleSave(e, place.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-20 group/heart"
            >
                <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'text-red-500 fill-current' : 'text-white group-hover/heart:text-red-500'}`} />
            </button>
        </div>

        {/* Content Overlay - Now floating over the bottom of the image for a more immersive look */}
        <div className="absolute bottom-0 inset-x-0 p-6 text-white transform transition-transform duration-500">
            <div className="flex items-center gap-2 mb-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                <div className="flex items-center gap-1 bg-[#D4AF37] text-black px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide">
                    <Star size={10} className="fill-black" />
                    {place.rating}
                </div>
                <div className="flex items-center gap-1 text-gray-300 text-[10px] font-medium tracking-wide">
                    <MapPin size={10} />
                    {place.location}
                </div>
            </div>

            <h4 className="font-serif text-2xl leading-none mb-2 drop-shadow-md group-hover:text-[#D4AF37] transition-colors duration-300">
                {place.title}
            </h4>

            <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                {place.description}
            </p>
        </div>
    </div>
);

export const FeaturedSection = ({ places = [], onCardClick, savedPlaceIds = [], onToggleSave, onSeeAllClick }) => {
    // Show first 5 places from the dynamic list for mobile scroll, or 4 for desktop grid
    const displayPlaces = places.length > 0 ? places.slice(0, 5) : featuredPlaces;

    return (
        <div className="py-8 transition-colors duration-200">
            <div className="flex justify-between items-end px-5 md:px-0 mb-8">
                <div>
                    <span className="text-[#D4AF37] font-black text-xs uppercase tracking-[0.3em] mb-2 block">Curated Collection</span>
                    <h3 className="text-3xl md:text-5xl font-serif text-gray-900 dark:text-white leading-none">Featured Spots</h3>
                </div>
                <button
                    onClick={onSeeAllClick}
                    className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                    See All Collection <MapPin size={14} />
                </button>
            </div>

            {/* Responsive Container: Horizontal Scroll on Mobile, Grid on Desktop */}
            <div className="flex space-x-6 overflow-x-auto px-5 pb-8 md:px-0 md:pb-0 md:space-x-0 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-8 custom-scrollbar md:overflow-visible snap-x">
                {displayPlaces.map((place, index) => (
                    <div
                        key={place.id}
                        className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <FeaturedCard
                            place={place}
                            onClick={onCardClick}
                            isSaved={savedPlaceIds.includes(place.id)}
                            onToggleSave={onToggleSave}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};


export const FeedbackSection = ({ userEmail, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { supabase } = await import('../lib/supabaseClient');

            if (supabase) {
                const feedbackData = {
                    user_email: userEmail || 'Anonymous',
                    comment: comment,
                    created_at: new Date().toISOString()
                };

                // Determine which table to use
                if (window.location.href.includes('admin') || !onSuccess) {
                    // Admin/General Feedback
                    const { error } = await supabase
                        .from('admin_feedback')
                        .insert([{ ...feedbackData, subject: 'General' }]);
                    if (error) throw error;
                } else {
                    // Partner/Spot Feedback (assuming we are on a place details view)
                    const { error } = await supabase
                        .from('partner_feedback')
                        .insert([{
                            ...feedbackData,
                            rating: rating,
                            spot_name: document.querySelector('h1')?.innerText || 'Unknown Spot'
                        }]);
                    if (error) throw error;
                }
            }

            // Fallback to local storage for instant UI update
            const feedback = {
                id: Date.now(),
                userEmail,
                rating,
                comment,
                timestamp: new Date().toISOString()
            };

            const isSiteFeedback = window.location.href.includes('admin') || !onSuccess;
            const storageKey = isSiteFeedback ? 'admin_feedback_local' : 'partner_feedback_local';
            const existingFeedback = JSON.parse(localStorage.getItem(storageKey) || '[]');
            localStorage.setItem(storageKey, JSON.stringify([feedback, ...existingFeedback]));

            setSubmitted(true);
            setComment('');
            if (onSuccess) onSuccess();
            setTimeout(() => setSubmitted(false), 3000);
        } catch (err) {
            console.error("Feedback error:", err);
            // Error is handled by console or parent
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl">
                    <MessageSquare className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                    <h3 className="text-xl font-serif text-gray-900 dark:text-white">Share Your Feedback</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Help us preserve Mysuru's spirit</p>
                </div>
            </div>

            {submitted ? (
                <div className="py-8 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="h-6 w-6 text-emerald-600" />
                    </div>
                    <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Feedback Received!</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setRating(num)}
                                className={`p-2 transition-all ${rating >= num ? 'text-amber-500 scale-110' : 'text-gray-300 dark:text-gray-600'}`}
                            >
                                <Star fill={rating >= num ? 'currentColor' : 'none'} size={24} />
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us about your experience..."
                        required
                        className="w-full h-32 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 bg-black dark:bg-[#D4AF37] text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-lg hover:scale-[1.02] active:scale-95 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Sending Heritage Echo...' : 'Submit Feedback'}
                    </button>
                </form>
            )}
        </div>
    );
};


export const Hero = ({ onExploreClick }) => {
    return (
        <div className="px-5 pt-8 pb-4 space-y-8 md:px-0 md:pt-12 md:pb-12">
            {/* Modern Search Bar */}
            <div className="relative group z-30 md:max-w-2xl md:mx-auto transform hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-14 pr-32 py-5 border-none rounded-[2rem] leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all font-medium text-sm md:text-base"
                    placeholder="Search for hidden gems, culture, food..."
                />
                <div className="absolute inset-y-2 right-2 flex items-center">
                    <button className="px-5 py-2.5 bg-black dark:bg-[#D4AF37] rounded-[1.5rem] text-white dark:text-black font-bold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/20 dark:shadow-[#D4AF37]/20">
                        Filter
                    </button>
                </div>
            </div>

            {/* Immersive Hero Card */}
            <div
                className="relative w-full h-[26rem] md:h-[36rem] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] group cursor-pointer"
                onClick={onExploreClick}
            >
                <div className="absolute inset-0 bg-gray-900 animate-pulse" /> {/* Loading state placeholder */}
                <img
                    src="/src/assets/mysore-palace-daytime.jpg"
                    alt="Mysore Palace"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                {/* Top Badge */}
                <div className="absolute top-8 left-8">
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full shadow-2xl">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_10px_#D4AF37]" />
                        <span className="text-white font-bold text-[10px] tracking-[0.2em] uppercase">Featured Destination</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="absolute bottom-10 left-8 right-8 md:left-12 md:bottom-12 max-w-2xl">
                    <div className="space-y-4 transform group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            <div className="bg-[#D4AF37] p-1.5 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                                <Compass className="w-4 h-4 text-black" />
                            </div>
                            <span className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.3em] drop-shadow-md">Beyond the Palace</span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-serif text-white leading-[0.9] tracking-tight drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                            Discover the <br />
                            <span className="italic relative inline-block">
                                Soul of Mysuru
                            </span>

                        </h2>

                        <p className="text-gray-200 text-sm md:text-lg font-medium leading-relaxed max-w-lg drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            Uncover hidden gems, local artisans & authentic experiences that usually go unnoticed by the casual eye.
                        </p>
                    </div>

                    {/* Explore Button */}
                    <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                        <button
                            className="group/btn relative overflow-hidden bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
                        >
                            <span className="relative z-10">
                                Start Exploring
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const Loader = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 4500); // 4.5 seconds to appreciate the premium animation

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f8f9fa] flex-col overflow-hidden transition-opacity duration-1000">
      <div className="relative flex flex-col items-center">

        {/* Logo Text */}
        <div className="flex items-baseline space-x-3 z-10 scale-110 sm:scale-125">
          <h1 className="text-5xl font-serif text-black tracking-tight opacity-0 animate-fade-in-up"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Mysuru
          </h1>
          <h1 className="text-5xl font-bold text-[#D4AF37] tracking-tight opacity-0 animate-fade-in-up-delay">
            marga
          </h1>
        </div>


        {/* Progress bar or subtle indicator */}
        <div className="mt-20 w-40 h-[1.5px] bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#D4AF37] animate-loading-progress shadow-[0_0_10px_#D4AF37]"></div>
        </div>

        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-gray-400 opacity-0 animate-fade-in-slow">
          Exploring Hidden Treasures
        </p>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(15px);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 0.6; }
        }
        @keyframes loading-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s forwards;
        }
        .animate-fade-in-up-delay {
          animation: fade-in-up 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.8s forwards;
        }
        .animate-fade-in-slow {
          animation: fade-in 2s ease-out 1.5s forwards;
        }
        .animate-loading-progress {
          animation: loading-progress 4.5s cubic-bezier(0.1, 0, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};


// Fix for default marker icons

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

export const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom || 15, { animate: true });
        }
    }, [center, zoom, map]);
    return null;
};

export const Map = ({ places, destination, interactive = true }) => {
    const defaultCenter = [12.3051, 76.6551]; // Mysuru Palace Area
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activePlace, setActivePlace] = useState(destination || null);
    const [showBookingPanel, setShowBookingPanel] = useState(false);
    const [bookingStage, setBookingStage] = useState('select'); // 'select', 'confirm', 'success'
    const [selectedCab, setSelectedCab] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const categories = ['All', 'Nature', 'Heritage', 'Food', 'Artisan', 'Stay'];

    const filteredPlaces = (places || []).filter(place => {
        const matchesSearch = place.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || place.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const suggestions = searchQuery.length > 1
        ? (places || []).filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
        : [];

    const handlePlaceSelect = (place) => {
        setActivePlace(place);
        setSearchQuery(place.title);
        setShowSuggestions(false);
        setShowBookingPanel(false);
        setBookingStage('select');
        setSelectedCab(null);
    };

    const cabOptions = [
        { id: 'bike', type: 'Bike / Two-Wheeler', price: 'â‚¹42', time: '2 min', icon: 'ðŸï¸', description: 'Fastest in traffic' },
        { id: 'auto', type: 'Auto Rickshaw', price: 'â‚¹68', time: '3 min', icon: 'ðŸ›º', description: 'Affordable for 3' },
        { id: 'mini', type: 'Cab Mini', price: 'â‚¹142', time: '5 min', icon: 'ðŸš—', description: 'Compact AC cars' },
        { id: 'prime', type: 'Cab Prime', price: 'â‚¹198', time: '6 min', icon: 'ðŸš•', description: 'Premium sedans' },
    ];

    const handleBookNow = (cab) => {
        setSelectedCab(cab);
        setBookingStage('confirm');
    };

    const confirmBooking = () => {
        setBookingStage('success');
        setTimeout(() => {
            setShowBookingPanel(false);
            setBookingStage('select');
        }, 3000);
    };

    const center = activePlace?.coords || defaultCenter;
    const zoom = activePlace ? 16 : 13;

    return (
        <div className="w-full relative overflow-hidden bg-gray-100" style={{ height: 'calc(100vh - 100px)' }}>
            {/* Search Bar Overlay - Only if Interactive */}
            {interactive && (
                <div className={`absolute top-4 left-4 right-4 z-[1000] space-y-3 transition-all duration-500 ${showBookingPanel ? '-translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full"></div>
                        <div className="relative flex items-center bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700 p-1">
                            <div className="p-3 text-gray-400">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search hidden gems..."
                                className="flex-1 bg-transparent border-none outline-none text-sm py-2 dark:text-gray-100 placeholder-gray-400"
                                value={searchQuery}
                                onFocus={() => setShowSuggestions(true)}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && suggestions.length > 0) {
                                        handlePlaceSelect(suggestions[0]);
                                    }
                                }}
                            />
                            {searchQuery && (
                                <button onClick={() => { setSearchQuery(''); setActivePlace(null); }} className="p-2 text-gray-400 hover:text-gray-600">
                                    <X size={16} />
                                </button>
                            )}
                            <button
                                onClick={() => suggestions.length > 0 && handlePlaceSelect(suggestions[0])}
                                className="p-2 mr-1 bg-mysore-gold/10 hover:bg-mysore-gold/20 text-mysore-gold rounded-xl transition-colors"
                            >
                                <Navigation size={20} className="fill-current" />
                            </button>
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in">
                                {suggestions.map(place => (
                                    <button
                                        key={place.id}
                                        onClick={() => handlePlaceSelect(place)}
                                        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-50 last:border-0"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-mysore-gold/10 flex items-center justify-center">
                                            <MapPin size={16} className="text-mysore-gold" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{place.title}</p>
                                            <p className="text-[10px] text-gray-500">{place.location}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${selectedCategory === cat
                                    ? 'bg-mysore-gold border-mysore-gold text-white shadow-lg shadow-mysore-gold/30'
                                    : 'bg-white border-white shadow-md text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Map Container - Explicit height to fix rendering issues */}
            <div className="w-full h-full absolute inset-0 z-0" onClick={() => setShowSuggestions(false)}>
                <MapContainer
                    center={center}
                    zoom={zoom}
                    scrollWheelZoom={true}
                    className="w-full h-full z-0 outline-none"
                    zoomControl={false}
                    style={{ height: '100%', width: '100%' }}
                >


                    <ChangeView center={center} zoom={zoom} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap'
                    />

                    {filteredPlaces.map(place => (
                        <Marker
                            key={place.id}
                            position={place.coords}
                            eventHandlers={{
                                click: () => handlePlaceSelect(place),
                            }}
                        >
                            <Popup>
                                <div className="p-1 min-w-[150px]">
                                    <h4 className="font-bold text-sm text-gray-900">{place.title}</h4>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                                        <Star size={10} className="text-yellow-500 fill-current" />
                                        <span>{place.rating}</span>
                                        <span>â€¢</span>
                                        <span>{place.category}</span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Floating Actions */}
            {interactive && (
                <div className={`absolute bottom-24 right-4 z-[1000] flex flex-col gap-3 transition-transform ${activePlace ? '-translate-y-48' : ''}`}>
                    <button
                        onClick={() => { setActivePlace(null); setShowBookingPanel(false); setSearchQuery(''); }}
                        className="p-3 bg-white dark:bg-gray-800 shadow-xl rounded-full text-gray-600 dark:text-gray-300 hover:scale-110 active:scale-95 transition-all border border-gray-100 dark:border-gray-700"
                    >
                        <Navigation size={22} />
                    </button>
                </div>
            )}

            {/* Bottom Info Card / Cab Facility */}
            {interactive && activePlace && (
                <div className="absolute bottom-6 left-4 right-4 z-[1000] transition-all duration-500">
                    <div className={`bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-500 ${showBookingPanel ? 'h-[420px]' : 'h-max'}`}>
                        {/* Header Image */}
                        <div className={`relative transition-all duration-500 ${showBookingPanel ? 'h-20' : 'h-32'}`}>
                            <img src={activePlace.image} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <button
                                onClick={() => { setActivePlace(null); setShowBookingPanel(false); setSearchQuery(''); }}
                                className="absolute top-3 right-3 p-1.5 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-black/60 transition-colors"
                            >
                                <X size={16} />
                            </button>
                            <div className="absolute bottom-3 left-4 text-white">
                                <h3 className="font-bold leading-tight">{activePlace.title}</h3>
                                <p className="text-[10px] opacity-80">{activePlace.location}</p>
                            </div>
                        </div>

                        <div className="p-5 h-full overflow-y-auto no-scrollbar">
                            {!showBookingPanel ? (
                                <div className="flex items-center justify-between animate-in">
                                    <div className="flex gap-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rating</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star size={14} className="text-yellow-500 fill-current" />
                                                <span className="font-bold text-base">{activePlace.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col border-l border-gray-100 dark:border-gray-800 pl-6">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimate</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Car size={14} className="text-mysore-gold" />
                                                <span className="font-bold text-base">â‚¹142</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowBookingPanel(true)}
                                        className="bg-mysore-gold text-white px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-mysore-gold/30 hover:scale-[1.05] active:scale-[0.95] transition-all"
                                    >
                                        <Car size={18} />
                                        Book Ride
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in">
                                    {bookingStage === 'select' && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Choose your vehicle</h4>
                                                <button onClick={() => setShowBookingPanel(false)} className="text-[10px] font-bold text-gray-400 uppercase">Cancel</button>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2">
                                                {cabOptions.map(cab => (
                                                    <div
                                                        key={cab.id}
                                                        onClick={() => handleBookNow(cab)}
                                                        className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-mysore-gold/30 rounded-2xl transition-all cursor-pointer group"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">{cab.icon}</div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{cab.type}</p>
                                                                <p className="text-[10px] text-gray-500">{cab.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-gray-900 dark:text-gray-100">{cab.price}</p>
                                                            <p className="text-[10px] text-green-500 font-bold">{cab.time}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {bookingStage === 'confirm' && selectedCab && (
                                        <div className="space-y-6 py-2">
                                            <div className="text-center space-y-2">
                                                <div className="w-20 h-20 bg-mysore-gold/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-pulse">
                                                    {selectedCab.icon}
                                                </div>
                                                <h4 className="text-lg font-bold">Confirm your {selectedCab.type}</h4>
                                                <p className="text-sm text-gray-500">Pick-up: Current Location<br />Drop-off: {activePlace.title}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setBookingStage('select')}
                                                    className="flex-1 py-4 border-2 border-gray-100 dark:border-gray-800 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={confirmBooking}
                                                    className="flex-[2] py-4 bg-black text-white rounded-2xl font-bold shadow-2xl hover:bg-gray-800 transition-colors"
                                                >
                                                    Confirm & Pay {selectedCab.price}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {bookingStage === 'success' && (
                                        <div className="flex flex-col items-center justify-center py-10 space-y-4 fade-in">
                                            <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                                                <Clock size={32} />
                                            </div>
                                            <div className="text-center">
                                                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">Booking Confirmed!</h4>
                                                <p className="text-sm text-gray-500 mt-1">Your driver is arriving in {selectedCab?.time}</p>
                                            </div>
                                            <div className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Driver Info</p>
                                                        <p className="text-sm font-bold">Suresh Kumar</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">OTP</p>
                                                        <p className="text-sm font-bold tracking-widest text-mysore-gold">4821</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};



export const Navbar = ({ onProfileClick, activeTab, setActiveTab }) => {
    const NavLink = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${activeTab === id
                ? 'bg-mysore-100 dark:bg-mysore-900/30 text-mysore-700 dark:text-mysore-400 font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
        >
            <Icon size={18} />
            <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
        </button>
    );

    return (
        <nav className="flex justify-between items-center px-6 py-6 border-b border-transparent md:border-gray-100 md:dark:border-gray-800 transition-colors duration-200">
            <div className="flex flex-col cursor-pointer" onClick={() => setActiveTab && setActiveTab('home')}>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide hidden md:block">Welcome to</span>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Mysuru <span className="text-mysore-600">Marga</span>
                </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-1.5 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">
                <NavLink id="home" icon={Home} label="Home" />
                <NavLink id="explore" icon={Compass} label="Explore" />
                <NavLink id="map" icon={Map} label="Map" />
                <NavLink id="saved" icon={Heart} label="Saved" />
            </div>

            <button
                onClick={onProfileClick}
                className="w-12 h-12 rounded-full bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all shadow-sm group"
                aria-label="Profile"
            >
                <div className="relative">
                    <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
            </button>
        </nav>
    );
};


export const PlaceCard = ({ image, category, title, description, location, rating, onClick, isSaved, onToggleSave }) => {
    return (
        <div
            onClick={onClick}
            className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none dark:border dark:border-gray-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 cursor-pointer relative"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                <button
                    onClick={onToggleSave}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-transform active:scale-90 group-hover:bg-white/30"
                >
                    <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                </button>

                {/* Category Badge */}
                <span className={`absolute top-4 left-4 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest text-white backdrop-blur-md
                    ${category === 'Hyperlocal Food' ? 'bg-emerald-500/80' :
                        category === 'Hidden Gems' ? 'bg-mysore-500/80' :
                            category === 'Heritage' ? 'bg-amber-600/80' : 'bg-gray-500/80'}`}>
                    {category}
                </span>

                {/* Rating Badge (Floating) */}
                <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white">{rating}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2 group-hover:text-mysore-700 transition-colors">
                    {title}
                </h3>

                <div className="flex items-start gap-2 text-gray-400 dark:text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-xs font-medium line-clamp-1">{location}</span>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};


export const PlaceDetails = ({ place, onBack, isSaved, onToggleSave, userEmail, onGetDirections }) => {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [localFeedbacks, setLocalFeedbacks] = useState([]);

    useEffect(() => {
        // Load initial feedbacks
        const feedbacks = JSON.parse(localStorage.getItem('user_feedback') || '[]');
        setLocalFeedbacks(feedbacks);

        // Listen for new feedbacks
        const handleStorageChange = () => {
            const updatedFeedbacks = JSON.parse(localStorage.getItem('user_feedback') || '[]');
            setLocalFeedbacks(updatedFeedbacks);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (!place) return null;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: place.title,
                text: place.description,
                url: window.location.href,
            }).catch(console.error);
        } else {
            // Fallback for browsers without share API
            navigator.clipboard.writeText(window.location.href);
            // We could add a toast here, but for now simple clipboard is better than ugly alert
        }
    };

    return (
        <div className="relative flex flex-col h-full bg-white dark:bg-gray-900 animate-in fade-in slide-in-from-right duration-300 overflow-hidden">
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto pb-6 custom-scrollbar">
                {/* Hero Image Section */}
                <div className="relative h-80 w-full shrink-0">
                    <img
                        src={place.image}
                        alt={place.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                    {/* Top Controls */}
                    <div className="absolute top-6 inset-x-0 px-6 flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={handleShare}
                                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => onToggleSave(e, place.id)}
                                className={`p-2 backdrop-blur-md rounded-full transition-colors ${isSaved ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Section - Overlapping Card */}
                <div className="relative -mt-10 bg-white dark:bg-gray-900 rounded-t-[32px] px-6 pt-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${place.categoryColor || 'bg-amber-600'}`}>
                                {place.category}
                            </span>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{place.rating}</span>
                                <span className="text-xs text-gray-500">(128)</span>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{place.title}</h1>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {place.description}
                            </p>
                        </div>

                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-4 py-4 border-y border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">{place.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">6:00 AM - 8:00 PM</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <IndianRupee className="w-4 h-4 text-gray-500" />
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">Budget Friendly</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {['#heritage', '#culture', '#mysore'].map(tag => (
                                <span key={tag} className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* About Section */}
                        <div className="mt-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">About</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {place.title} is a landmark destination in Mysore that offers an authentic glimpse into local life.
                                The vibrant atmosphere, historic architecture, and unique offerings make it a must-visit for anyone
                                exploring the cultural landscape of the city.
                            </p>
                        </div>

                        {/* Highlights */}
                        <div className="mt-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Highlights</h2>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    "150+ year old heritage market",
                                    "Famous for Mysore jasmine garlands",
                                    "Traditional spices and sandalwood",
                                    "Best local street food"
                                ].map((highlight, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-emerald-50/50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100/50 dark:border-emerald-800/30">
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{highlight}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Best Time to Visit */}
                        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/50">
                            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-400 mb-1">Best Time to Visit</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-500 font-medium leading-relaxed">
                                Early morning (6-8 AM) for the freshest flowers and produce
                            </p>
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-8 mb-10">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reviews</h2>
                                <button
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="text-sm font-bold text-amber-600 hover:text-amber-700"
                                >
                                    {showReviewForm ? 'View Reviews' : 'Write Review'}
                                </button>
                            </div>

                            {showReviewForm ? (
                                <FeedbackSection
                                    userEmail={userEmail}
                                    onSuccess={() => {
                                        // Update local state immediately after submission
                                        const updatedFeedbacks = JSON.parse(localStorage.getItem('user_feedback') || '[]');
                                        setLocalFeedbacks(updatedFeedbacks);
                                        // Optionally close the form after a delay or instantly
                                        setTimeout(() => setShowReviewForm(false), 2000);
                                    }}
                                />
                            ) : (
                                <div className="space-y-4">
                                    {localFeedbacks.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                                            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                                                <MessageSquare className="w-6 h-6 text-gray-300" />
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No reviews yet. Be the first!</p>
                                        </div>
                                    ) : (
                                        localFeedbacks.map((fb) => (
                                            <div key={fb.id} className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-xs">
                                                            {fb.userEmail?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-900 dark:text-white">{fb.userEmail}</p>
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star key={star} size={10} className={star <= fb.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold">
                                                        {new Date(fb.timestamp).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">"{fb.comment}"</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Actions Container */}
            <div className="bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            const url = `https://m.uber.com/ul/?action=setPickup&client_id=YOUR_CLIENT_ID&pickup=my_location&dropoff[formatted_address]=${place.title}+Mysore&dropoff[nickname]=${place.title}`;
                            window.open(url, '_blank');
                        }}
                        className="flex-1 bg-black dark:bg-gray-800 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                        <Car className="w-5 h-5" />
                        Book Ride
                    </button>
                    <button
                        onClick={() => {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${place.title}+Mysore`;
                            window.open(url, '_blank');
                        }}
                        className="flex-1 bg-[#D4AF37] hover:bg-[#B8962F] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 transition-all active:scale-95"
                    >
                        <Navigation className="w-5 h-5 fill-current" />
                        Directions
                    </button>
                </div>
            </div>
        </div>
    );
};


export const Saved = ({ savedPlaceIds = [], allPlaces = [], onToggleSave, onCardClick }) => {
    const savedPlaces = allPlaces.filter(place => savedPlaceIds.includes(place.id));

    if (savedPlaces.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] px-4 text-center">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 transition-colors">
                    <Heart className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Saved Places Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                    Start exploring and save your favorite hidden gems to create your personal itinerary.
                </p>
            </div>
        );
    }

    return (
        <div className="px-4 py-4 pb-20">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Saved Places ({savedPlaces.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedPlaces.map(place => (
                    <PlaceCard
                        key={place.id}
                        {...place}
                        isSaved={true}
                        onToggleSave={(e) => onToggleSave(e, place.id)}
                        onClick={() => onCardClick && onCardClick(place)}
                    />
                ))}
            </div>
        </div>
    );
};

