import React, { useState, useEffect } from 'react';
import { Users, Map, BarChart3, LogOut, Shield, Search, Star, MessageSquare, Inbox, Check, X, Clock, Handshake, TrendingUp, Settings, Bell, Lock, Globe, Database, ExternalLink, Download, Trash2, RefreshCcw } from 'lucide-react';
import { allPlaces } from './App';

import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Mail, Phone, Shield, Handshake } from 'lucide-react';
import { supabase } from './Supabase';
import {
import { Settings, Shield, Heart, HelpCircle, Info, ChevronRight, User, Phone, Mail, ArrowLeft, Bell, Moon, MapPin, Globe, Lock, FileText, ExternalLink, MessageSquare } from 'lucide-react';



export const AdminDashboard = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [userFilter, setUserFilter] = useState('all'); // 'all', 'user', 'partner'
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminSettings, setAdminSettings] = useState({
        publicRegistration: true,
        partnerVerification: true,
        globalBroadcasts: true
    });
    const [siteFeedback, setSiteFeedback] = useState([]);
    const [spotsCount, setSpotsCount] = useState(allPlaces.length);
    const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null, type: 'danger' });
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    // Load users from Supabase
    const loadUsers = async () => {
        setLoading(true);
        try {
            const { supabase } = await import('../lib/supabaseClient');

            if (supabase) {
                // Fetch all profiles from the custom table we created
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('updated_at', { ascending: false });

                if (!error && data) {
                    const supabaseUsers = data.map(u => ({
                        fullName: u.full_name || u.fullName || 'Resident',
                        email: u.email,
                        phone: u.phone || 'â€“',
                        role: u.role || 'user',
                        joinedAt: u.updated_at || u.created_at,
                        source: 'Supabase'
                    }));
                    setUsers(supabaseUsers);
                } else {
                    console.error("Supabase fetch error:", error);
                    // Fallback to local if Supabase fails or table doesn't exist yet
                    const storedUsers = localStorage.getItem('usersDB');
                    if (storedUsers) setUsers(JSON.parse(storedUsers));
                }
            } else {
                // Pure demo mode fallback
                const storedUsers = localStorage.getItem('usersDB');
                if (storedUsers) setUsers(JSON.parse(storedUsers));
            }
        } catch (error) {
            console.error("Critical failure loading users", error);
        }
        setLoading(false);
    };

    const loadSpotsCount = async () => {
        try {
            const { supabase } = await import('../lib/supabaseClient');
            if (supabase) {
                const { count, error } = await supabase
                    .from('heritage_spots')
                    .select('*', { count: 'exact', head: true });

                if (!error && count !== null) {
                    setSpotsCount(count);
                }
            }
        } catch (err) {
            console.error("Error loading spots count:", err);
        }
    };

    const loadFeedback = async () => {
        try {
            const { supabase } = await import('../lib/supabaseClient');
            if (supabase) {
                const { data, error } = await supabase
                    .from('admin_feedback')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) {
                    setSiteFeedback(data.map(f => ({
                        id: f.id,
                        userEmail: f.email || 'Anonymous Traveler',
                        rating: f.rating,
                        comment: f.comment,
                        timestamp: f.created_at
                    })));
                }
            }
        } catch (err) {
            console.error("Error loading feedback:", err);
        }
    };

    useEffect(() => {
        loadUsers();
        loadFeedback();
        loadSpotsCount();
    }, []);

    const totalUsers = users.length;
    const partnersCount = users.filter(u => u.role === 'partner').length;

    const handleTabChange = (tab, filter = 'all') => {
        setActiveTab(tab);
        setUserFilter(filter);
    };

    const handleDeleteUser = async (email) => {
        setConfirmModal({
            show: true,
            title: 'Remove Resident',
            message: `Are you sure you want to remove ${email} from the registry? This action cannot be undone.`,
            type: 'danger',
            onConfirm: async () => {
                try {
                    const { supabase } = await import('../lib/supabaseClient');

                    // 1. Delete from Supabase profiles table
                    if (supabase) {
                        const { error } = await supabase
                            .from('profiles')
                            .delete()
                            .eq('email', email);

                        if (error) {
                            console.error("Supabase deletion error:", error.message);
                        }
                    }

                    // 2. Fallback/Cleanup for Local Storage
                    const storedUsers = JSON.parse(localStorage.getItem('usersDB') || '[]');
                    const updatedUsers = storedUsers.filter(u => u.email !== email);
                    localStorage.setItem('usersDB', JSON.stringify(updatedUsers));

                    // 3. Update UI State
                    setUsers(prev => prev.filter(u => u.email !== email));
                    showNotification(`${email} has been removed.`);
                } catch (err) {
                    console.error("Critical error during deletion:", err);
                    showNotification("Deletion failed.", "error");
                }
                setConfirmModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const toggleSetting = (key) => {
        setAdminSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleReset = () => {
        setConfirmModal({
            show: true,
            title: 'System Reset',
            message: 'CRITICAL ACTION: This will reset all administrative overrides. Are you absolutely sure?',
            type: 'danger',
            onConfirm: () => {
                showNotification("System state normalized.");
                setConfirmModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    return (
        <div className="min-h-screen bg-mysore-light dark:bg-mysore-dark font-sans transition-colors duration-500 flex selection:bg-[#D4AF37]/30">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl w-72 border-r border-gray-100 dark:border-gray-800 shadow-2xl z-30 hidden lg:flex flex-col">
                <div className="p-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                        <Shield className="h-6 w-6 text-black" />
                    </div>
                    <div>
                        <h1 className="text-xl font-serif text-black dark:text-white leading-none">Mysuru</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Administration</p>
                    </div>
                </div>

                <nav className="flex-1 px-6 space-y-3">
                    <NavItem icon={<TrendingUp />} label="Overview" active={activeTab === 'overview'} onClick={() => handleTabChange('overview')} />
                    <NavItem icon={<Users />} label="Residents" active={activeTab === 'users'} onClick={() => handleTabChange('users', 'all')} />
                    <NavItem icon={<Inbox />} label="Invitations" active={activeTab === 'invites'} onClick={() => handleTabChange('invites')} />
                    <NavItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => handleTabChange('settings')} />
                </nav>

                <div className="p-8">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-4 w-full px-6 py-4 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all font-bold text-sm"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:ml-72 flex-1 h-screen overflow-y-auto custom-scrollbar">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                            <Shield className="h-5 w-5 text-black" />
                        </div>
                        <span className="font-serif text-lg text-black dark:text-white">Admin Core</span>
                    </div>
                    <button onClick={onLogout} className="p-2 text-gray-500 hover:text-red-500">
                        <LogOut className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-8 lg:p-12 max-w-7xl mx-auto">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            totalUsers={totalUsers}
                            partnersCount={partnersCount}
                            activeLocations={spotsCount}
                            siteFeedback={siteFeedback}
                            onNavigate={handleTabChange}
                        />
                    )}
                    {activeTab === 'users' && (
                        <UsersTab
                            users={users}
                            loading={loading}
                            filter={userFilter}
                            setFilter={setUserFilter}
                            onDeleteUser={handleDeleteUser}
                        />
                    )}
                    {activeTab === 'invites' && (
                        <InvitationsTab showNotification={showNotification} />
                    )}
                    {activeTab === 'settings' && (
                        <SettingsTab settings={adminSettings} onToggle={toggleSetting} loadUsers={loadUsers} handleReset={handleReset} />
                    )}
                </div>
            </main>

            {/* Custom Confirmation Modal */}
            {confirmModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}></div>
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 sm:p-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${confirmModal.type === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                <Shield className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-serif text-black dark:text-white mb-3">{confirmModal.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">{confirmModal.message}</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                                    className="flex-1 py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmModal.onConfirm}
                                    className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 ${confirmModal.type === 'danger' ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-black dark:bg-[#D4AF37] text-white dark:text-black shadow-black/20'}`}
                                >
                                    Confirm Action
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Toast Notification */}
            {notification.show && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[101] animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-black dark:bg-gray-800 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-4 border border-white/10">
                        <div className={`w-2 h-2 rounded-full ${notification.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`}></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{notification.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${active
            ? 'bg-black dark:bg-[#D4AF37] text-white dark:text-black shadow-xl shadow-black/10 dark:shadow-[#D4AF37]/20 scale-[1.02]'
            : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800/50 hover:text-black dark:hover:text-white'
            }`}>
        {React.cloneElement(icon, { size: 20 })}
        <span className="font-bold text-sm">{label}</span>
    </button>
);

export const StatCard = ({ title, value, change, icon, bg, onClick }) => (
    <button
        onClick={onClick}
        className="text-left w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 hover:scale-[1.02] transition-all group"
    >
        <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl ${bg} group-hover:scale-110 transition-transform duration-500`}>
                {icon}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-black">
                <TrendingUp size={12} />
                <span>{change}</span>
            </div>
        </div>
        <h3 className="text-4xl font-serif text-black dark:text-white mb-2 leading-none">{value}</h3>
        <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
    </button>
);

export const OverviewTab = ({ totalUsers, partnersCount, activeLocations, siteFeedback, onNavigate }) => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
            <h2 className="text-5xl font-serif text-black dark:text-white leading-tight">Welcome Back</h2>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
                title="Total Residents"
                value={totalUsers}
                change="+12.4%"
                icon={<Users className="h-7 w-7 text-blue-600" />}
                bg="bg-blue-100 dark:bg-blue-900/30"
                onClick={() => onNavigate('users', 'user')}
            />
            <StatCard
                title="Verified Heritage Spots"
                value={activeLocations}
                change="+5.2%"
                icon={<Map className="h-7 w-7 text-emerald-600" />}
                bg="bg-emerald-100 dark:bg-emerald-900/30"
            />
            <StatCard
                title="Active Partners"
                value={partnersCount}
                change="+24.8%"
                icon={<BarChart3 className="h-7 w-7 text-amber-600" />}
                bg="bg-amber-100 dark:bg-amber-900/30"
                onClick={() => onNavigate('users', 'partner')}
            />
        </div>

        {/* Heritage Pulse Map Integration */}
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[3rem] shadow-2xl p-10 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h3 className="text-2xl font-serif text-black dark:text-white">Live Heritage Pulse</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Real-time spatial activity across Mysuru</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">System Nominal</span>
                </div>
            </div>

            <div className="h-[450px] rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 relative shadow-inner group">
                <MapComponent />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute bottom-8 left-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 pointer-events-none opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                    <p className="text-white text-xs font-bold uppercase tracking-widest leading-relaxed">Global Heritage Node Override Active</p>
                </div>
            </div>
        </div>

        {/* Recent Feedback Section */}
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[3rem] shadow-2xl p-10 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                    <MessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-serif text-black dark:text-white">Recent Feedback</h3>
                </div>
            </div>

            <div className="space-y-6">
                {(() => {
                    const feedback = siteFeedback;
                    if (feedback.length === 0) {
                        return (
                            <div className="py-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem]">
                                <p className="text-gray-400 font-serif italic">Silence in the halls of feedback...</p>
                            </div>
                        );
                    }
                    return feedback.slice(0, 5).map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-800/40 p-6 rounded-[2rem] border border-gray-50 dark:border-gray-700/50 hover:scale-[1.01] transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 font-black text-sm">
                                        {item.userEmail.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-black dark:text-white">{item.userEmail}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star size={12} fill="currentColor" />
                                    <span className="text-sm font-black">{item.rating}</span>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm italic leading-relaxed">"{item.comment}"</p>
                        </div>
                    ));
                })()}
            </div>
        </div>
    </div>
);

export const UsersTab = ({ users, filter, setFilter, onDeleteUser }) => {
    const filteredUsers = (filter === 'all'
        ? [...users]
        : users.filter(user => user.role === filter))
        .sort((a, b) => new Date(b.joinedAt || 0) - new Date(a.joinedAt || 0));

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-3">Resident Management</p>
                    <h2 className="text-4xl font-serif text-black dark:text-white capitalize">
                        {filter === 'all' ? 'The Collective' : `${filter} Directory`}
                    </h2>
                </div>

                <div className="flex flex-wrap gap-2 p-1.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-700">
                    {['all', 'user', 'partner', 'admin'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === f
                                ? 'bg-black dark:bg-[#D4AF37] text-white dark:text-black shadow-lg'
                                : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Identity</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Role</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Contact</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Date</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {filteredUsers.map((user, index) => (
                                <tr key={index} className="group hover:bg-white dark:hover:bg-gray-800/80 transition-colors">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-black text-xl shadow-inner">
                                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <div className="font-serif text-lg text-black dark:text-white leading-tight mb-1">{user.fullName}</div>
                                                <div className="text-xs text-gray-400 font-medium lowercase tracking-tighter">{user.email || 'No email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                        ${user.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' :
                                                user.role === 'partner' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' :
                                                    'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="text-xs font-bold text-gray-500">{user.phone || 'â€“'}</div>
                                    </td>
                                    <td className="px-10 py-8 text-xs font-bold text-gray-400">
                                        {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Heritage Epoch'}
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button
                                            onClick={() => onDeleteUser(user.email)}
                                            className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                        >
                                            <X size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export const InvitationsTab = ({ showNotification }) => {
    const [invites, setInvites] = useState([]);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        let allApps = [];

        // 1. Try Supabase
        try {
            const { supabase } = await import('../lib/supabaseClient');
            if (supabase) {
                const { data, error } = await supabase
                    .from('partner_applications')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!error && data) {
                    allApps = data.map(inv => ({
                        id: inv.id,
                        partnerName: inv.full_name,
                        partnerEmail: inv.email,
                        spotName: inv.spot_name,
                        status: inv.status,
                        timestamp: inv.created_at,
                        source: 'cloud'
                    }));
                }
            }
        } catch (err) {
            console.warn("Supabase fetch failed for apps:", err);
        }

        // 2. Load Local Invites
        const local = JSON.parse(localStorage.getItem('collaboration_invites') || '[]');
        const localApps = local.map(inv => ({
            ...inv,
            source: 'local',
            // Ensure schema compatibility
            partnerName: inv.partnerName || inv.full_name,
            partnerEmail: inv.partnerEmail || inv.email,
            timestamp: inv.timestamp || inv.created_at
        }));

        // 3. Merge
        const combined = [...allApps, ...localApps].sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        setInvites(combined);
    };

    const handleStatusUpdate = async (invite, newStatus) => {
        try {
            const { supabase } = await import('../lib/supabaseClient');

            // 1. Update Cloud (if applicable)
            if (supabase && invite.source === 'cloud') {
                const { error: updateError } = await supabase
                    .from('partner_applications')
                    .update({ status: newStatus })
                    .eq('id', invite.id);

                if (updateError) throw updateError;
            }

            // 2. Update Local (always, to be safe or if local source)
            const local = JSON.parse(localStorage.getItem('collaboration_invites') || '[]');
            const updatedLocal = local.map(inv => {
                if (inv.id === invite.id || inv.partnerEmail === invite.partnerEmail) {
                    return { ...inv, status: newStatus };
                }
                return inv;
            });
            localStorage.setItem('collaboration_invites', JSON.stringify(updatedLocal));

            // 3. Update UI state
            setInvites(prev => prev.map(inv =>
                (inv.id === invite.id) ? { ...inv, status: newStatus } : inv
            ));

            // 4. If accepted, sync to the verified_partners table (Cloud)
            if (newStatus === 'accepted' && supabase) {
                await supabase
                    .from('verified_partners')
                    .upsert({
                        partner_name: invite.partnerName,
                        partner_email: invite.partnerEmail,
                        spot_name: invite.spotName,
                        category: invite.category || 'Heritage',
                        status: 'verified'
                    }, { onConflict: 'partner_email' });
            }
            showNotification(`Application ${newStatus}.`);
        } catch (err) {
            console.error("Error updating status:", err);
            showNotification("Protocol update failed.", "error");
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-3">Partnership Protocol</p>
                <h2 className="text-5xl font-serif text-black dark:text-white truncate">Collaboration Requests</h2>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {invites.length === 0 ? (
                    <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2.5rem] p-24 text-center border border-dashed border-gray-200 dark:border-gray-800">
                        <Inbox size={64} className="mx-auto text-gray-200 dark:text-gray-700 mb-6" />
                        <p className="text-gray-400 font-serif text-2xl italic tracking-wide">No petitioners at the gate...</p>
                    </div>
                ) : (
                    invites.map(invite => (
                        <div key={invite.id} className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:scale-[1.01] transition-all duration-300">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 font-serif text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    {invite.partnerName ? invite.partnerName.charAt(0) : '?'}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4">
                                        <h4 className="text-2xl font-serif text-black dark:text-white">{invite.partnerName}</h4>
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${invite.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                            invite.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' :
                                                'bg-rose-100 text-rose-600'
                                            }`}>
                                            {invite.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 text-xs font-bold text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Handshake size={14} className="text-[#D4AF37]" />
                                            <span className="uppercase tracking-widest">{invite.spotName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} />
                                            <span>{new Date(invite.timestamp).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {invite.status === 'pending' && (
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleStatusUpdate(invite, 'rejected')}
                                        className="h-14 w-14 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl transition-all"
                                    >
                                        <X size={24} />
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(invite, 'accepted')}
                                        className="h-14 px-10 bg-black dark:bg-[#D4AF37] text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all"
                                    >
                                        Accept Invite
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export const SettingsTab = ({ settings, onToggle, loadUsers }) => {
    const downloadCSV = (filename, content) => {
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/csv' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
    };

    const handleExportUsers = () => {
        const users = JSON.parse(localStorage.getItem('usersDB') || '[]');
        if (!users.length) {
            alert('No residents found in registry.');
            return;
        }

        // Sanitize data: Remove sensitive fields like passwords
        const sanitizedUsers = users.map(({ password, confirmPassword, ...rest }) => rest);

        const headers = Object.keys(sanitizedUsers[0]).join(',');
        const rows = sanitizedUsers.map(u => Object.values(u).map(v => `"${v}"`).join(',')).join('\n');
        downloadCSV('mysuru_residents.csv', headers + '\n' + rows);
    };

    const handleClearCache = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-3">Core Configuration</p>
                <h2 className="text-5xl font-serif text-black dark:text-white truncate">Administrative Settings</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Governance (State Toggles) */}
                <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl">
                            <Shield className="h-6 w-6 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-serif text-black dark:text-white">General Governance</h3>
                    </div>
                    {/* Keeps existing toggles */}
                    <div className="space-y-4">
                        <AdminSettingItem icon={<Globe />} label="Public Registration" description="Allow new user identities" checked={settings.publicRegistration} onToggle={() => onToggle('publicRegistration')} />
                        <AdminSettingItem icon={<Lock />} label="Partner Verification" description="Require manual approval" checked={settings.partnerVerification} onToggle={() => onToggle('partnerVerification')} />
                        <AdminSettingItem icon={<Bell />} label="Global Broadcasts" description="Enable announcements" checked={settings.globalBroadcasts} onToggle={() => onToggle('globalBroadcasts')} />
                    </div>
                </div>

                {/* Data Actions (New) */}
                <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                            <Database className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-serif text-black dark:text-white">Data Management</h3>
                    </div>

                    <div className="space-y-4">
                        <button onClick={handleExportUsers} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all group">
                            <div className="flex items-center gap-4">
                                <Download className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={20} />
                                <div className="text-left">
                                    <h4 className="text-sm font-bold text-black dark:text-white">Export Registry</h4>
                                    <p className="text-[10px] text-gray-400 font-medium">Download resident data (CSV)</p>
                                </div>
                            </div>
                        </button>

                        <button onClick={loadUsers} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all group">
                            <div className="flex items-center gap-4">
                                <RefreshCcw className="text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" size={20} />
                                <div className="text-left">
                                    <h4 className="text-sm font-bold text-black dark:text-white">Refresh Nodes</h4>
                                    <p className="text-[10px] text-gray-400 font-medium">Re-synchronize with database</p>
                                </div>
                            </div>
                        </button>

                        <button onClick={handleClearCache} className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all group border border-transparent hover:border-red-200">
                            <div className="flex items-center gap-4">
                                <Trash2 className="text-red-400 group-hover:text-red-600 transition-colors" size={20} />
                                <div className="text-left">
                                    <h4 className="text-sm font-bold text-red-600 dark:text-red-400">Purge Local Cache</h4>
                                    <p className="text-[10px] text-red-400/70 font-medium">Clear app state & logout</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AdminSettingItem = ({ icon, label, description, checked, onToggle }) => (
    <div
        onClick={onToggle}
        className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded-2xl transition-all cursor-pointer"
    >
        <div className="flex items-center gap-4">
            <div className="text-gray-400">{icon}</div>
            <div>
                <h4 className="text-sm font-bold text-black dark:text-white">{label}</h4>
                <p className="text-[10px] text-gray-400 font-medium">{description}</p>
            </div>
        </div>
        <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${checked ? 'bg-black dark:bg-[#D4AF37]' : 'bg-gray-200 dark:bg-gray-800'}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${checked ? 'translate-x-7' : 'translate-x-1'}`}></div>
        </div>
    </div>
);


export const AuthPage = ({ onLogin, onSignUp }) => {
    const [isSignUp, setIsSignUp] = useState(false);

    // Login State
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Sign-Up State
    const [signUpData, setSignUpData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        agreeToTerms: false
    });
    const [signUpErrors, setSignUpErrors] = useState({});
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // --- Login Handlers ---
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoggingIn(true);

        // 1. Quick Testing Credentials (REMOVED FOR SECURITY)
        // Hardcoded backdoors have been removed to ensure production security.


        // 2. Local Registry Check (Username support)
        const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
        const localUser = usersDB.find(u => u.email === loginIdentifier || u.fullName.toLowerCase() === loginIdentifier.toLowerCase());

        // SECURITY NOTICE: This logic allowed password-less login for local usernames.
        // It has been disabled to ensure the website is safe.
        /*
        // If it's a username login or known local user, let them in immediately
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier);
        if (!isEmail && localUser) {
            localStorage.setItem('userData', JSON.stringify(localUser));
            onLogin(localUser.role, localUser);
            setIsLoggingIn(false);
            return;
        }
        */

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier);

        // 3. Supabase Cloud Check
        if (supabase) {
            if (!isEmail) {
                setLoginError('Security Update: Please use your Email Address to log in. Username login is no longer supported.');
                setIsLoggingIn(false);
                return;
            }

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: loginIdentifier,
                    password: loginPassword
                });

                if (!error && data.user) {
                    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
                    const role = profile?.role || 'user';
                    onLogin(role, { ...profile, email: data.user.email });
                    setIsLoggingIn(false);
                    return;
                }
            } catch (err) {
                console.error("Cloud login attempt failed");
            }
        }

        // 4. Final Fallback (For unverified Supabase emails stored locally)
        // 4. Fallback: If Supabase login failed or wasn't available, we CANNOT verify password locally anymore.
        // We only allow login if Supabase verified it, OR if we are in a pure offline demo mode where we don't check security.
        // However, for strict security requested by USER, we should not allow fallback login if Supabase exists.

        if (!supabase && localUser) {
            // DEMO MODE ONLY: If no Supabase client exists, allow simplistic login
            localStorage.setItem('userData', JSON.stringify(localUser));
            onLogin(localUser.role, localUser);
        } else if (localUser && !supabase) {
            // This branch is redundant but keeps logic clear: if Supabase exists, we already tried and failed above.
            // So we do NOT allow local password check because we deleted local passwords.
        } else {
            setLoginError('No account found or incorrect credentials.');
        }
        setIsLoggingIn(false);
    };

    // --- Sign-Up Handlers ---
    const validateSignUp = () => {
        const newErrors = {};
        if (!signUpData.fullName.trim()) newErrors.fullName = 'Required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!signUpData.email || !emailRegex.test(signUpData.email)) newErrors.email = 'Invalid email';
        if (signUpData.password.length < 8) {
            newErrors.password = 'Min 8 chars';
        } else if (!/(?=.*[a-z])/.test(signUpData.password)) {
            newErrors.password = 'Need lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(signUpData.password)) {
            newErrors.password = 'Need uppercase letter';
        } else if (!/(?=.*\d)/.test(signUpData.password)) {
            newErrors.password = 'Need a number';
        } else if (!/(?=.*[@$!%*?&#])/.test(signUpData.password)) {
            newErrors.password = 'Need special char (@$!%*?&#)';
        }
        if (signUpData.password !== signUpData.confirmPassword) newErrors.confirmPassword = 'No match';
        if (!signUpData.agreeToTerms) newErrors.agreeToTerms = 'Required';
        setSignUpErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [verificationSent, setVerificationSent] = useState(false);

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        if (!validateSignUp()) return;

        const newUser = {
            fullName: signUpData.fullName,
            email: signUpData.email,
            phone: signUpData.phone,
            // Password intentionally omitted for security - stored only in Supabase
            role: signUpData.role,
            joinedAt: new Date().toISOString(),
            status: 'Active'
        };

        /* LEGACY LOCAL STORAGE - DISABLED FOR SECURITY
        const usersDB = JSON.parse(localStorage.getItem('usersDB') || '[]');
        if (!usersDB.some(u => u.email === signUpData.email)) {
             usersDB.push(newUser);
             localStorage.setItem('usersDB', JSON.stringify(usersDB));
        }
        */

        if (!supabase) {
            localStorage.setItem('userData', JSON.stringify(newUser));
            onSignUp(signUpData.role, newUser);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email: signUpData.email,
                password: signUpData.password,
                options: { data: { full_name: signUpData.fullName, role: signUpData.role, phone: signUpData.phone } }
            });
            if (error) throw error;

            // If email confirmation is ON, session will be null
            if (data.user && !data.session) {
                setVerificationSent(true);
            } else if (data.session) {
                // If email confirmation is OFF, we get a session immediately
                onSignUp(signUpData.role, { full_name: signUpData.fullName, email: signUpData.email, phone: signUpData.phone, role: signUpData.role });
            }
        } catch (error) {
            console.error("Sign Up Error:", error);

            let displayError = error.message;
            if (error.message.includes("Database error")) {
                displayError = "System Update: We are upgrading our heritage registry. Please try again later.";
                console.warn("DEVELOPER NOTE: This error is likely coming from a Postgres Trigger in Supabase (e.g., 'handle_new_user'). Check if the Trigger is failing to insert into the 'profiles' table, possibly due to RLS policies or missing columns.");
            }

            setSignUpErrors(prev => ({ ...prev, submit: displayError }));
        }
    };

    const handleSignUpChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSignUpData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    return (
        <div className="min-h-screen bg-mysore-light dark:bg-mysore-dark flex items-center justify-center p-6 transition-colors duration-500 overflow-hidden font-sans">
            {/* Background Decorative Blurs */}
            <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/20 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-black/10 rounded-full blur-[150px]"></div>
            </div>

            {/* Main Auth Container */}
            <div className={`relative w-full max-w-6xl h-[85vh] bg-white/70 dark:bg-gray-900/70 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-1000 border border-white/20 dark:border-gray-800`}>

                {/* Visual Branding Overlay (The Sliding Part) */}
                <div
                    className={`absolute top-0 bottom-0 z-30 w-full md:w-[60%] transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) transform overflow-hidden ${isSignUp ? 'translate-x-0 md:translate-x-[66.6%]' : 'translate-x-0 md:translate-x-0'
                        }`}
                >
                    <div className="absolute inset-0 z-40 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <img
                        src="/src/assets/mysore-palace-daytime.jpg"
                        alt="Mysore Palace"
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[2500ms] ${isSignUp ? 'scale-125 md:translate-x-10' : 'scale-110 translate-x-0'}`}
                    />

                    <div className="absolute bottom-16 left-16 right-16 z-50 text-white">
                        <p className="text-sm font-bold uppercase tracking-[0.6em] text-[#D4AF37] mb-4 drop-shadow-md">Beyond the Palace</p>
                        <h2 className="text-5xl lg:text-7xl font-serif mb-8 drop-shadow-lg leading-tight">Discover the <br />Soul of Mysuru</h2>
                        <p className="text-lg text-gray-200 max-w-md drop-shadow-md font-light leading-relaxed opacity-90">
                            Uncover hidden gems, local artisans & authentic experiences that usually go unexplored.
                        </p>
                    </div>
                </div>

                {/* Form Panels Container */}
                <div className="relative w-full h-full flex flex-col md:flex-row">

                    {/* LEFT PANEL (Sign Up) */}
                    <div className={`w-full md:w-[40%] h-full flex items-center justify-center p-8 lg:p-16 transition-all duration-1000 ease-in-out ${isSignUp ? 'opacity-100 translate-x-0 z-20' : 'opacity-0 translate-x-20 pointer-events-none z-10'
                        }`}>
                        <div className="w-full max-w-sm">
                            <div className="mb-10">
                                <h1 className="text-4xl font-serif text-gray-900 dark:text-white mb-4">Create Account</h1>
                            </div>

                            {verificationSent ? (
                                <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                                        <Mail className="w-10 h-10 text-emerald-600" />
                                    </div>
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-serif text-gray-900 dark:text-white">Heritage Registry Active</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                            Your account has been recorded in the Supabase database.
                                            A verification scroll was sent to <span className="font-bold text-gray-900 dark:text-white">{signUpData.email}</span>.
                                        </p>
                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/20">
                                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">Success</p>
                                            <p className="text-[10px] text-emerald-500 font-medium">Data preserved. You may proceed to explore while verification is pending.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => {
                                                const newUser = {
                                                    fullName: signUpData.fullName,
                                                    email: signUpData.email,
                                                    phone: signUpData.phone,
                                                    role: signUpData.role,
                                                    joinedAt: new Date().toISOString(),
                                                };
                                                localStorage.setItem('userData', JSON.stringify(newUser));
                                                onSignUp(signUpData.role, newUser);
                                            }}
                                            className="w-full py-5 bg-black dark:bg-[#D4AF37] text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] transition-all"
                                        >
                                            Proceed to Dashboard
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsSignUp(false);
                                                setVerificationSent(false);
                                            }}
                                            className="w-full py-5 border-2 border-gray-100 dark:border-gray-800 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                                        >
                                            Sign In Manually
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <form onSubmit={handleSignUpSubmit} className="space-y-4">
                                        <div className="flex gap-4 mb-8">
                                            {['user', 'partner'].map(r => (
                                                <button
                                                    key={r}
                                                    type="button"
                                                    onClick={() => setSignUpData(prev => ({ ...prev, role: r }))}
                                                    className={`flex-1 flex items-center justify-center gap-3 py-4 px-4 rounded-2xl border transition-all duration-300 ${signUpData.role === r
                                                        ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5 ring-1 ring-[#D4AF37]/20 shadow-sm'
                                                        : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-transparent'
                                                        }`}
                                                >
                                                    {r === 'user' ? <User size={18} strokeWidth={2} /> : <Handshake size={18} strokeWidth={2} />}
                                                    <span className="text-xs font-bold uppercase tracking-widest">{r}</span>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#D4AF37] transition-colors" />
                                                <input type="text" name="fullName" value={signUpData.fullName} onChange={handleSignUpChange} placeholder="Full Name" className={`w-full pl-12 pr-4 py-4 border ${signUpErrors.fullName ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'} rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-sm focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all`} />
                                                {signUpErrors.fullName && <p className="text-[10px] text-red-500 font-bold mt-1 px-4">{signUpErrors.fullName}</p>}
                                            </div>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#D4AF37] transition-colors" />
                                                <input type="email" name="email" value={signUpData.email} onChange={handleSignUpChange} placeholder="Email" className={`w-full pl-12 pr-4 py-4 border ${signUpErrors.email ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'} rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-sm focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all`} />
                                                {signUpErrors.email && <p className="text-[10px] text-red-500 font-bold mt-1 px-4">{signUpErrors.email}</p>}
                                            </div>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#D4AF37] transition-colors" />
                                                <input type="tel" name="phone" value={signUpData.phone} onChange={handleSignUpChange} placeholder="Phone Number" className="w-full pl-12 pr-4 py-4 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-sm focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <input
                                                        type={showSignUpPassword ? "text" : "password"}
                                                        name="password"
                                                        value={signUpData.password}
                                                        onChange={handleSignUpChange}
                                                        placeholder="Password"
                                                        className={`w-full pl-5 pr-10 py-4 border ${signUpErrors.password ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'} rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-sm focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors"
                                                    >
                                                        {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                    {signUpErrors.password && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{signUpErrors.password}</p>}
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        name="confirmPassword"
                                                        value={signUpData.confirmPassword}
                                                        onChange={handleSignUpChange}
                                                        placeholder="Confirm"
                                                        className={`w-full pl-5 pr-10 py-4 border ${signUpErrors.confirmPassword ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'} rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-sm focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                    {signUpErrors.confirmPassword && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{signUpErrors.confirmPassword}</p>}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 px-2 py-2">
                                                <input
                                                    type="checkbox"
                                                    name="agreeToTerms"
                                                    id="agreeToTerms"
                                                    checked={signUpData.agreeToTerms}
                                                    onChange={handleSignUpChange}
                                                    className="w-4 h-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                                                />
                                                <label htmlFor="agreeToTerms" className={`text-[10px] font-bold uppercase tracking-widest ${signUpErrors.agreeToTerms ? 'text-red-500' : 'text-gray-400'}`}>
                                                    I agree to the Heritage Protocol
                                                </label>
                                            </div>
                                        </div>

                                        {signUpErrors.submit && (
                                            <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest bg-red-50 dark:bg-red-900/10 py-4 rounded-2xl border border-red-100 dark:border-red-900/20">
                                                {signUpErrors.submit}
                                            </p>
                                        )}

                                        <button type="submit" className="w-full py-5 bg-black dark:bg-[#D4AF37] text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 shadow-black/20">
                                            Create Heritage ID
                                        </button>
                                    </form>

                                    <p className="mt-12 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                        Already a resident? {' '}
                                        <button onClick={() => setIsSignUp(false)} className="text-[#D4AF37] ml-2 hover:underline">Log In</button>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL (Login) */}
                    <div className={`w-full md:w-[40%] h-full ml-auto flex items-center justify-center p-8 lg:p-16 transition-all duration-1000 ease-in-out ${!isSignUp ? 'opacity-100 translate-x-0 z-20' : 'opacity-0 -translate-x-20 pointer-events-none z-10'
                        }`}>
                        <div className="w-full max-w-sm">
                            <div className="mb-12 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start mb-10 group cursor-default">
                                    <span className="text-5xl font-serif text-black dark:text-white tracking-tighter group-hover:tracking-normal transition-all duration-700">Mysuru</span>
                                    <span className="text-5xl font-bold text-[#D4AF37] ml-2">Marga</span>
                                </div>
                                <h1 className="text-4xl font-serif text-gray-900 dark:text-white mb-3">Welcome Back</h1>
                                <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Access the heritage core</p>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="space-y-6">
                                <div className="space-y-5">
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#D4AF37] transition-colors" />
                                        <input
                                            type="text"
                                            value={loginIdentifier}
                                            onChange={(e) => setLoginIdentifier(e.target.value)}
                                            placeholder="Email Address"
                                            className="w-full pl-16 pr-6 py-6 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all shadow-inner"
                                            required
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#D4AF37] transition-colors" />
                                        <input
                                            type={showLoginPassword ? 'text' : 'password'}
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            placeholder="Password"
                                            className="w-full pl-16 pr-16 py-6 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all shadow-inner"
                                            required
                                        />
                                        <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors">
                                            {showLoginPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                        </button>
                                    </div>
                                </div>

                                {loginError && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest bg-red-50 dark:bg-red-900/10 py-4 rounded-2xl border border-red-100 dark:border-red-900/20">{loginError}</p>}

                                <button
                                    type="submit"
                                    disabled={isLoggingIn}
                                    className="w-full py-6 bg-black dark:bg-[#D4AF37] text-white dark:text-black rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_25px_50px_-15px_rgba(212,175,55,0.4)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-500 mt-4 flex items-center justify-center"
                                >
                                    {isLoggingIn ? (
                                        <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        'Enter The Gates'
                                    )}
                                </button>
                            </form>

                            <p className="mt-16 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                New to the City? {' '}
                                <button onClick={() => setIsSignUp(true)} className="text-[#D4AF37] ml-2 hover:underline">Register Now</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

    LayoutDashboard,
    Store,
    MessageSquare,
    Settings,
    LogOut,
    TrendingUp,
    Users,
    Star,
    Camera,
    Plus,
    Clock,
    MapPin,
    Utensils,
    Palette,
    Sparkles,
    Send,
    Inbox,
    Calendar,
    Ticket
} from 'lucide-react';

export const PartnerDashboard = ({ onLogout, partnerData }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [feedbacks, setFeedbacks] = useState([]);
    const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null, type: 'danger' });
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    React.useEffect(() => {
        loadSpotFeedback();
    }, [partnerData]);

    const loadSpotFeedback = async () => {
        try {
            const { supabase } = await import('../lib/supabaseClient');
            if (supabase && partnerData?.spotName) {
                const { data, error } = await supabase
                    .from('partner_feedback')
                    .select('*')
                    .eq('spot_name', partnerData.spotName)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setFeedbacks(data || []);
            }
        } catch (err) {
            console.error("Error loading spot feedback:", err);
            // Local fallback
            const local = JSON.parse(localStorage.getItem('user_feedback') || '[]');
            setFeedbacks(local);
        }
    };

    const realReviewsCount = feedbacks.length;
    const realAvgRating = feedbacks.length > 0
        ? (feedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / feedbacks.length).toFixed(1)
        : "5.0";

    // Mock data for the partner's spot with dynamic reviews/rating
    const spotData = {
        name: partnerData?.spotName || "Karanji Lake",
        category: partnerData?.category || "Nature",
        rating: realAvgRating,
        reviewsCount: realReviewsCount,
        totalVisits: 842 + realReviewsCount, // Added real reviews to visit count for demo
        status: "Online",
        images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
        description: "Serene nature trail with butterfly park and panoramic palace views. A pristine sanctuary in the heart of Mysore.",
        openingHours: "6:00 AM - 8:00 PM",
        location: "Siddhartha Layout, Mysuru"
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab spot={spotData} setActiveTab={setActiveTab} feedbacks={feedbacks} />;
            case 'manage':
                return <ManageSpotTab spot={spotData} showNotification={showNotification} />;
            case 'reviews':
                return <ReviewsTab feedbacks={feedbacks} />;
            case 'invites':
                return <InvitationsTab partner={partnerData} spot={spotData} showNotification={showNotification} />;
            case 'events':
                return <EventsTab partner={partnerData} spot={spotData} setConfirmModal={setConfirmModal} showNotification={showNotification} />;
            case 'settings':
                return <SettingsTab partner={partnerData} />;
            default:
                return <OverviewTab spot={spotData} setActiveTab={setActiveTab} feedbacks={feedbacks} />;
        }
    };

    return (
        <div className="min-h-screen bg-mysore-light dark:bg-mysore-dark font-sans flex transition-colors duration-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-100 dark:border-gray-800 hidden md:flex flex-col fixed h-full z-30">
                <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                    <h1 className="text-2xl font-serif text-black dark:text-white tracking-tight">
                        Mysuru <span className="font-bold text-[#D4AF37]">Partner</span>
                    </h1>
                </div>

                <nav className="flex-1 p-6 space-y-3">
                    <NavItem
                        icon={<LayoutDashboard />}
                        label="Dashboard"
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                    />
                    <NavItem
                        icon={<Store />}
                        label="Manage Spot"
                        active={activeTab === 'manage'}
                        onClick={() => setActiveTab('manage')}
                    />
                    <NavItem
                        icon={<MessageSquare />}
                        label="Reviews"
                        active={activeTab === 'reviews'}
                        onClick={() => setActiveTab('reviews')}
                    />
                    <NavItem
                        icon={<Inbox />}
                        label="Invitations"
                        active={activeTab === 'invites'}
                        onClick={() => setActiveTab('invites')}
                    />
                    <NavItem
                        icon={<Calendar />}
                        label="Events & Offers"
                        active={activeTab === 'events'}
                        onClick={() => setActiveTab('events')}
                    />
                    <NavItem
                        icon={<Settings />}
                        label="Settings"
                        active={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}
                    />
                </nav>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all font-bold text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 md:p-12 h-screen overflow-y-auto custom-scrollbar">
                <div className="max-w-6xl mx-auto">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-4xl font-serif text-black dark:text-white">
                                Welcome, {partnerData?.fullName?.split(' ')[0] || "Partner"}
                            </h2>
                            <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
                                Managing <span className="text-[#D4AF37]">"{spotData.name}"</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-400">Live Status</span>
                        </div>
                    </header>

                    {renderContent()}
                </div>
            </main>

            {/* Custom Confirmation Modal */}
            {confirmModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}></div>
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 sm:p-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${confirmModal.type === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                <Settings className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-serif text-black dark:text-white mb-3">{confirmModal.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">{confirmModal.message}</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                                    className="flex-1 py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmModal.onConfirm}
                                    className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 ${confirmModal.type === 'danger' ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-black dark:bg-[#D4AF37] text-white dark:text-black shadow-black/20'}`}
                                >
                                    Confirm Action
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Toast Notification */}
            {notification.show && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[101] animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-black dark:bg-gray-800 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-4 border border-white/10">
                        <div className={`w-2 h-2 rounded-full ${notification.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`}></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{notification.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${active
            ? 'bg-black dark:bg-[#D4AF37] text-white dark:text-black shadow-xl shadow-[#D4AF37]/10 translate-x-1'
            : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
            }`}
    >
        {React.cloneElement(icon, { size: 20 })}
        <span>{label}</span>
    </button>
);

export const OverviewTab = ({ spot, setActiveTab }) => (
    <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <StatCard
                label="Reviews"
                value={spot.reviewsCount}
                trend="+5 new"
                icon={<MessageSquare className="text-purple-600" />}
                bgColor="bg-purple-50 dark:bg-purple-900/20"
                onClick={() => setActiveTab('reviews')}
            />
            <StatCard
                label="Profile Views"
                value="8"
                trend="+18%"
                icon={<Users className="text-emerald-600" />}
                bgColor="bg-emerald-50 dark:bg-emerald-900/20"
                onClick={() => setActiveTab('overview')}
            />
        </div>

        {/* Live Heritage Map Spotlight */}
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2.5rem] shadow-xl p-10 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h3 className="text-2xl font-serif text-black dark:text-white">Heritage Map Presence</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Your spot's spatial identity in the Mysuru ecosystem</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Live Elevation</span>
                </div>
            </div>
            <div className="h-[400px] rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-700 relative shadow-inner group">
                <MapComponent interactive={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-8 left-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 pointer-events-none opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <p className="text-white text-xs font-bold uppercase tracking-widest">Sovereign Explorer View</p>
                </div>
            </div>
        </div>

        {/* Spot Preview */}
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-xl border border-gray-100 dark:border-gray-800 transition-all hover:scale-[1.01]">
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="w-full lg:w-1/3 h-64 rounded-3xl overflow-hidden shadow-2xl relative">
                    <img src="/karanji.jpg" alt="Spot Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-4 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-[#D4AF37]/20">{spot.category}</span>
                    </div>
                    <h3 className="text-3xl font-serif text-black dark:text-white mb-4">{spot.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 line-clamp-2 md:line-clamp-none mb-8 font-medium leading-relaxed text-sm">
                        {spot.description}
                    </p>
                    <div className="flex flex-wrap gap-8 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        <div className="flex items-center gap-3">
                            <MapPin size={16} className="text-[#D4AF37]" />
                            <span>{spot.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock size={16} className="text-[#D4AF37]" />
                            <span>{spot.openingHours}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black dark:bg-[#D4AF37] rounded-[2rem] p-10 text-white dark:text-black relative overflow-hidden group shadow-2xl">
                <div className="relative z-10">
                    <h3 className="text-2xl font-serif mb-2">Boost your visibility</h3>
                    <p className="opacity-80 font-medium mb-8 text-sm">Create a special offer for visitors and get featured on the "Near You" section.</p>
                    <button
                        onClick={() => setActiveTab('events')}
                        className="bg-[#D4AF37] dark:bg-black text-black dark:text-[#D4AF37] px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl text-sm"
                    >
                        <Sparkles size={20} />
                        <span>Create Offer</span>
                    </button>
                </div>
                <Sparkles className="absolute -bottom-4 -right-4 w-40 h-40 opacity-10 group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-10 border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col justify-center">
                <h3 className="text-2xl font-serif text-black dark:text-white mb-2">Update your photos</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium text-sm">Clear photos of your work and workspace increase visitor trust by 40%.</p>
                <div className="flex items-center gap-3">
                    <button className="bg-gray-50 dark:bg-gray-800 text-black dark:text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-sm shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                        <Camera size={20} className="text-[#D4AF37]" />
                        <span>Upload Photos</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export const ManageSpotTab = ({ spot }) => (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden px-10 py-12">
        <h3 className="text-3xl font-serif text-black dark:text-white mb-10">Curation Details</h3>
        <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Heritage Spot Name</label>
                    <input
                        type="text"
                        defaultValue={spot.name}
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all font-medium text-sm shadow-inner"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Classification</label>
                    <select
                        defaultValue="Hidden Gem"
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all font-bold text-sm shadow-inner appearance-none cursor-pointer"
                    >
                        <option>Local Artisan</option>
                        <option>Hyperlocal Food</option>
                        <option>Hidden Gem</option>
                        <option>Cultural Experience</option>
                        <option>Nature</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Soulful Narrative</label>
                <textarea
                    rows="4"
                    defaultValue={spot.description}
                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all font-medium text-sm shadow-inner resize-none"
                ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Sacred Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={18} />
                        <input
                            type="text"
                            defaultValue={spot.location}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-medium text-sm shadow-inner"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Traditional Hours</label>
                    <div className="relative">
                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={18} />
                        <input
                            type="text"
                            defaultValue={spot.openingHours}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-medium text-sm shadow-inner"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Contact Presence</label>
                    <input
                        type="text"
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-medium text-sm shadow-inner"
                    />
                </div>
            </div>

            <div className="pt-6">
                <button
                    type="submit"
                    onClick={(e) => {
                        e.preventDefault();
                        showNotification("Heritage records preserved.");
                    }}
                    className="bg-black dark:bg-[#D4AF37] text-white dark:text-black px-12 py-5 rounded-2xl font-black shadow-2xl shadow-[#D4AF37]/20 active:scale-95 transition-all text-xs uppercase tracking-[0.2em]"
                >
                    Preserve Changes
                </button>
            </div>
        </form>
    </div>
);

export const ReviewsTab = ({ feedbacks }) => (
    <div className="space-y-8">
        <h3 className="text-3xl font-serif text-black dark:text-white mb-4">Traveler Echoes</h3>
        <div className="space-y-6">
            {feedbacks.length === 0 ? (
                <div className="py-24 text-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-800">
                    <MessageSquare size={64} className="mx-auto text-gray-200 dark:text-gray-800 mb-6" />
                    <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">No traveler echoes yet</p>
                </div>
            ) : (
                feedbacks.map((feedback, i) => (
                    <div key={feedback.id} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 transition-all hover:translate-x-1 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                                    {feedback.userEmail ? feedback.userEmail.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{feedback.userEmail || "Anonymous Traveler"}</h4>
                                    <div className="flex text-[#D4AF37] mt-1.5 gap-0.5">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} size={12} className={star <= feedback.rating ? "fill-current" : "text-gray-300 dark:text-gray-600"} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                {new Date(feedback.timestamp).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-sm italic">
                            "{feedback.comment}"
                        </p>
                        <button className="mt-6 text-[#D4AF37] font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-2">
                            <MessageSquare size={14} />
                            <span>Acknowledge Thought</span>
                        </button>
                    </div>
                ))
            )}
        </div>
    </div>
);

export const SettingsTab = ({ partner }) => (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-12">
        <h3 className="text-3xl font-serif text-black dark:text-white mb-12">Heritage Identity</h3>
        <div className="space-y-12">
            <div className="flex items-center gap-8 pb-12 border-b border-gray-100 dark:border-gray-800">
                <div className="w-24 h-24 rounded-3xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shadow-inner">
                    <Users size={40} />
                </div>
                <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{partner?.fullName || "Heritage Partner"}</h4>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1.5">{partner?.email || "curator@mysurumarga.com"}</p>
                </div>
                <button className="ml-auto bg-black dark:bg-[#D4AF37] text-white dark:text-black px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Relocate Photo</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">Echo Notifications</h4>
                    <p className="text-xs text-gray-400 font-medium mb-6">Receive spiritual alerts when traveler echoes are recorded.</p>
                    <div className="w-14 h-7 bg-[#D4AF37] rounded-full relative cursor-pointer ring-4 ring-[#D4AF37]/10">
                        <div className="absolute right-1 top-1 w-5 h-5 bg-black rounded-full shadow-lg"></div>
                    </div>
                </div>
                <div className="p-8 rounded-3xl bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">Heritage Visibility</h4>
                    <p className="text-xs text-gray-400 font-medium mb-6">Toggle your spot's presence in the physical soul of the app.</p>
                    <div className="w-14 h-7 bg-[#D4AF37] rounded-full relative cursor-pointer ring-4 ring-[#D4AF37]/10">
                        <div className="absolute right-1 top-1 w-5 h-5 bg-black rounded-full shadow-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const InvitationsTab = ({ partner, spot, showNotification }) => {
    const [invites, setInvites] = useState(() => {
        const stored = localStorage.getItem('collaboration_invites');
        const allInvites = stored ? JSON.parse(stored) : [];
        return allInvites.filter(inv => inv.partnerEmail === partner?.email);
    });

    const [isSending, setIsSending] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    React.useEffect(() => {
        loadInvites();
    }, [partner]);

    const loadInvites = async () => {
        let allInvites = [];

        // 1. Try Supabase
        try {
            const { supabase } = await import('../lib/supabaseClient');
            if (supabase && partner?.email) {
                const { data, error } = await supabase
                    .from('partner_applications')
                    .select('*')
                    .eq('email', partner.email)
                    .order('created_at', { ascending: false });

                if (!error && data) {
                    allInvites = data.map(inv => ({
                        id: inv.id,
                        partnerName: inv.full_name,
                        partnerEmail: inv.email,
                        spotName: inv.spot_name,
                        status: inv.status,
                        timestamp: inv.created_at,
                        source: 'cloud'
                    }));
                }
            }
        } catch (err) {
            console.warn("Supabase load failed, using local fallback only:", err);
        }

        // 2. Load Local Invites
        const local = JSON.parse(localStorage.getItem('collaboration_invites') || '[]');
        const partnerLocal = local.filter(inv => inv.partnerEmail === partner?.email)
            .map(inv => ({ ...inv, source: 'local' }));

        // 3. Merge and set
        const combined = [...allInvites, ...partnerLocal].sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        setInvites(combined);
    };

    const sendInvite = async () => {
        setIsSending(true);
        const timestamp = new Date().toISOString();
        const newInviteData = {
            id: partner?.id || Date.now(),
            partnerName: partner?.fullName || 'Partner',
            partnerEmail: partner?.email || 'N/A',
            spotName: spot.name,
            category: spot.category,
            status: 'pending',
            timestamp: timestamp
        };

        let transmitted = false;

        // 1. Try Supabase
        try {
            const { supabase } = await import('../lib/supabaseClient');
            if (supabase) {
                const { data, error } = await supabase
                    .from('partner_applications')
                    .insert([{
                        user_id: partner?.id,
                        full_name: partner?.fullName || 'Partner',
                        email: partner?.email || 'N/A',
                        spot_name: spot.name,
                        category: spot.category,
                        status: 'pending'
                    }])
                    .select();

                if (!error && data && data[0]) {
                    transmitted = true;
                    // Already in local state if we wait for loadInvites or just prepend
                }
            }
        } catch (err) {
            console.error("Cloud transmission skipped/failed:", err);
        }

        // Always fallback to localStorage to ensure it "works" for the user
        const local = JSON.parse(localStorage.getItem('collaboration_invites') || '[]');
        localStorage.setItem('collaboration_invites', JSON.stringify([newInviteData, ...local]));

        setInvites(prev => [newInviteData, ...prev]);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setIsSending(false);
    };

    return (
        <div className="space-y-10">
            <div className="bg-black dark:bg-[#D4AF37] rounded-[2.5rem] p-12 text-white dark:text-black shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                    <h3 className="text-3xl font-serif mb-3">Partner with Sovereignty</h3>
                    <p className="opacity-80 font-medium mb-10 max-w-lg text-sm leading-relaxed">Send a formal collaboration invite to the Heritage Administration to request verification badges, curated placement, or royal features.</p>
                    <button
                        onClick={sendInvite}
                        disabled={isSending}
                        className={`bg-[#D4AF37] dark:bg-black text-black dark:text-[#D4AF37] px-10 py-5 rounded-2xl font-black flex items-center gap-4 hover:scale-105 transition-all shadow-xl text-xs uppercase tracking-widest ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSending ? (
                            <div className="w-5 h-5 border-2 border-black dark:border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Send size={20} />
                        )}
                        <span>{isSending ? 'Transmitting...' : 'Request Heritage Collaboration'}</span>
                    </button>
                    {showSuccess && (
                        <div className="mt-6 bg-emerald-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest animate-bounce inline-block shadow-lg">
                            Invitation Transmitted
                        </div>
                    )}
                </div>
                <Send className="absolute -bottom-6 -right-6 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-2xl font-serif text-black dark:text-white">Request Chronicle</h3>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    {invites.length === 0 ? (
                        <div className="py-24 text-center">
                            <Inbox size={64} className="mx-auto text-gray-200 dark:text-gray-800 mb-6" />
                            <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">No recent requests</p>
                        </div>
                    ) : (
                        invites.map(invite => (
                            <div key={invite.id} className="px-10 py-8 flex items-center justify-between transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                                        <Send size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Collaboration Protocol</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                            <Clock size={12} className="text-[#D4AF37]" />
                                            <span>{new Date(invite.timestamp).toLocaleDateString()} at {new Date(invite.timestamp).toLocaleTimeString()}</span>
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${invite.status === 'pending' ? 'bg-amber-500/10 text-amber-600 ring-amber-500/20' :
                                    invite.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20' :
                                        'bg-red-500/10 text-red-600 ring-red-500/20'
                                    }`}>
                                    {invite.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export const StatCard = ({ label, value, trend, icon, bgColor, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden group cursor-pointer transition-all hover:-translate-y-1"
    >
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${bgColor}`}>
                    {React.cloneElement(icon, { size: 24 })}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full ring-1 ring-green-100 dark:ring-green-900/50">
                    {trend}
                </span>
            </div>
            <h4 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{value}</h4>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
    </div>
);

export const EventsTab = ({ partner, spot, setConfirmModal, showNotification }) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        type: 'Festival',
        price: 'Free'
    });

    React.useEffect(() => {
        loadEvents();
    }, [partner]);

    const loadEvents = async () => {
        setIsLoading(true);
        try {
            const { supabase } = await import('../lib/supabaseClient');
            if (supabase && partner?.email) {
                const { data, error } = await supabase
                    .from('heritage_events')
                    .select('*')
                    .eq('partner_email', partner.email)
                    .order('event_date', { ascending: true });

                if (error) throw error;
                setEvents(data || []);
            }
        } catch (err) {
            console.error("Error loading events:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const { supabase } = await import('../lib/supabaseClient');
            if (supabase) {
                const eventData = {
                    partner_email: partner.email,
                    spot_name: spot.name,
                    title: newEvent.title,
                    description: newEvent.description,
                    event_date: newEvent.date,
                    event_type: newEvent.type,
                    price: newEvent.price,
                    status: 'active'
                };

                const { data, error } = await supabase
                    .from('heritage_events')
                    .insert([eventData])
                    .select();

                if (error) throw error;

                if (data) {
                    setEvents(prev => [...prev, data[0]]);
                    setShowForm(false);
                    setNewEvent({ title: '', description: '', date: '', type: 'Festival', price: 'Free' });
                    showNotification("Event chronicle created.");
                }
            }
        } catch (err) {
            console.error("Failed to create event:", err);
            showNotification("Protocol failed.", "error");
        } finally {
            setIsCreating(false);
        }
    };

    const deleteEvent = async (id) => {
        setConfirmModal({
            show: true,
            title: 'Retire Event',
            message: 'Are you sure you want to retire this event from the chronicle? This action is permanent.',
            type: 'danger',
            onConfirm: async () => {
                try {
                    const { supabase } = await import('../lib/supabaseClient');
                    if (supabase) {
                        const { error } = await supabase
                            .from('heritage_events')
                            .delete()
                            .eq('id', id);

                        if (error) throw error;
                        setEvents(events.filter(e => e.id !== id));
                        showNotification("Chronicle entry removed.");
                    }
                } catch (err) {
                    console.error("Error deleting event:", err);
                    showNotification("Protocol update failed.", "error");
                }
                setConfirmModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <h3 className="text-3xl font-serif text-black dark:text-white">Heritage Chronicles</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-black dark:bg-[#D4AF37] text-white dark:text-black px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl text-xs uppercase tracking-widest"
                >
                    {showForm ? <Inbox size={18} /> : <Plus size={18} />}
                    <span>{showForm ? 'View Events' : 'Promote Event'}</span>
                </button>
            </div>

            {showForm ? (
                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[2.5rem] p-12 border border-gray-100 dark:border-gray-800 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h4 className="text-2xl font-serif text-black dark:text-white mb-10">New Event Protocol</h4>
                    <form onSubmit={handleCreateEvent} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Event Title</label>
                                <input
                                    required
                                    type="text"
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                    placeholder="e.g. Dasara Workshop Special"
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 text-black dark:text-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Event Type</label>
                                <select
                                    value={newEvent.type}
                                    onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 text-black dark:text-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-bold cursor-pointer"
                                >
                                    <option>Festival</option>
                                    <option>Workshop</option>
                                    <option>Special Offer</option>
                                    <option>Guided Tour</option>
                                    <option>Art Exhibition</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Soulful Description</label>
                            <textarea
                                required
                                rows="3"
                                value={newEvent.description}
                                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                placeholder="Describe the heritage experience..."
                                className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 text-black dark:text-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-medium resize-none"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Temporal Marker (Date)</label>
                                <input
                                    required
                                    type="date"
                                    value={newEvent.date}
                                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 text-black dark:text-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Energy Exchange (Price)</label>
                                <input
                                    type="text"
                                    value={newEvent.price}
                                    onChange={e => setNewEvent({ ...newEvent, price: e.target.value })}
                                    placeholder="Free or â‚¹ Amount"
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 text-black dark:text-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isCreating}
                            className={`w-full bg-black dark:bg-[#D4AF37] text-white dark:text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all ${isCreating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
                        >
                            {isCreating ? 'Archiving to History...' : 'Commence Event'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {isLoading ? (
                        <div className="col-span-2 py-24 text-center">
                            <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Calling the Ancients...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="col-span-2 py-24 text-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800">
                            <Calendar size={64} className="mx-auto text-gray-200 dark:text-gray-800 mb-6" />
                            <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">The chronicles are currently silent</p>
                        </div>
                    ) : (
                        events.map(event => (
                            <div key={event.id} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl group hover:translate-x-1 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${event.event_type === 'Festival' ? 'bg-amber-500/10 text-amber-600 ring-amber-500/20' :
                                        event.event_type === 'Workshop' ? 'bg-indigo-500/10 text-indigo-600 ring-indigo-500/20' :
                                            'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20'
                                        }`}>
                                        {event.event_type}
                                    </div>
                                    <button
                                        onClick={() => deleteEvent(event.id)}
                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <LogOut size={16} className="rotate-90" />
                                    </button>
                                </div>
                                <h4 className="text-xl font-serif text-black dark:text-white mb-3 group-hover:text-[#D4AF37] transition-colors">{event.title}</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 line-clamp-2 font-medium leading-relaxed italic">"{event.description}"</p>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Clock size={14} className="text-[#D4AF37]" />
                                        <span>{new Date(event.event_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Ticket size={14} className="text-[#D4AF37]" />
                                        <span>{event.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};


export const ProfilePage = ({ onBack, isDarkMode, onToggleDarkMode, onLogout, userData, onUpdateProfile, savedPlaceIds, allPlaces }) => {
    const [currentView, setCurrentView] = useState('main');

    const renderView = () => {
        switch (currentView) {
            case 'settings':
                return <SettingsView onBack={() => setCurrentView('main')} isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} onUpdateProfile={onUpdateProfile} userData={userData} />;
            case 'privacy':
                return <PrivacyView onBack={() => setCurrentView('main')} onUpdateProfile={onUpdateProfile} userData={userData} />;
            case 'wishlist':
                return <WishlistView onBack={() => setCurrentView('main')} savedPlaceIds={savedPlaceIds} allPlaces={allPlaces} />;
            case 'help':
                return <HelpView onBack={() => setCurrentView('main')} />;
            case 'about':
                return <AboutView onBack={() => setCurrentView('main')} />;
            case 'feedback':
                return <FeedbackView onBack={() => setCurrentView('main')} userData={userData} />;
            default:
                return (
                    <MainProfileView
                        onBack={onBack}
                        onNavigate={setCurrentView}
                        onLogout={onLogout}
                        userData={userData}
                    />
                );
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-full pb-20 transition-colors duration-200">
            {renderView()}
        </div>
    );
};

export const MainProfileView = ({ onBack, onNavigate, onLogout, userData }) => (
    <>
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 px-4 py-4 flex items-center shadow-sm sticky top-0 z-10 border-b dark:border-gray-800 transition-colors duration-200">
            <button onClick={onBack} className="mr-4 text-gray-600 dark:text-gray-300">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
        </div>

        {/* User Info */}
        <div className="bg-white dark:bg-gray-900 mt-4 px-4 py-6 flex items-center transition-colors duration-200">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-500 mb-0 mr-4 font-bold text-2xl">
                {(userData?.fullName || userData?.full_name || 'G').charAt(0).toUpperCase()}
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {userData?.fullName || userData?.full_name || 'Guest User'}
                </h2>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                    <Mail className="w-3.5 h-3.5 mr-1.5" />
                    <span>{userData?.email || 'No email provided'}</span>
                </div>
                {userData?.phone && (
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                        <Phone className="w-3.5 h-3.5 mr-1.5" />
                        <span>{userData?.phone}</span>
                    </div>
                )}
            </div>
        </div>

        {/* Menu Options */}
        <div className="mt-6 bg-white dark:bg-gray-900 transition-colors duration-200">
            <MenuItem icon={Settings} label="Settings" onClick={() => onNavigate('settings')} />
            <MenuItem icon={Shield} label="Privacy Settings" onClick={() => onNavigate('privacy')} />
            <MenuItem icon={Heart} label="Wishlist" onClick={() => onNavigate('wishlist')} />
            <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => onNavigate('help')} />
            <MenuItem icon={Info} label="About App" onClick={() => onNavigate('about')} />
            <MenuItem icon={MessageSquare} label="Share Feedback" onClick={() => onNavigate('feedback')} />
        </div>

        <div className="px-4 mt-8">
            <button
                onClick={onLogout}
                className="w-full py-3 text-red-500 font-medium bg-white dark:bg-gray-800 rounded-lg border border-red-100 dark:border-red-900/30 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
                Log Out
            </button>
            <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4">Version 1.0.0</p>
        </div>
    </>
);

export const SettingsView = ({ onBack, isDarkMode, onToggleDarkMode, onUpdateProfile, userData }) => {

    const handleToggle = (key, value) => {
        if (onUpdateProfile) {
            onUpdateProfile({ [key]: value });
        }
    };

    return (
        <>
            <SubViewHeader title="Settings" onBack={onBack} />
            <div className="mt-4 bg-white dark:bg-gray-900 transition-colors duration-200">
                <ToggleItem
                    icon={Bell}
                    label="Notifications"
                    checked={userData?.notifications !== false}
                    onToggle={() => handleToggle('notifications', !userData?.notifications)}
                />
                <ToggleItem
                    icon={Moon}
                    label="Dark Mode"
                    checked={isDarkMode}
                    onToggle={onToggleDarkMode}
                />
                <ToggleItem
                    icon={MapPin}
                    label="Location Services"
                    checked={userData?.locationServices !== false}
                    onToggle={() => handleToggle('locationServices', !userData?.locationServices)}
                />
                <div className="h-px bg-gray-50 dark:bg-gray-800 my-2"></div>
                <MenuItem icon={Globe} label="Language" value="English" />
            </div>
        </>
    );
};

export const PrivacyView = ({ onBack, onUpdateProfile, userData }) => {
    const handleToggle = (key, value) => {
        if (onUpdateProfile) {
            onUpdateProfile({ [key]: value });
        }
    };

    return (
        <>
            <SubViewHeader title="Privacy Settings" onBack={onBack} />
            <div className="mt-4 bg-white dark:bg-gray-900 transition-colors duration-200">
                <ToggleItem
                    icon={Lock}
                    label="Profile Visibility"
                    checked={userData?.isProfilePublic || false}
                    onToggle={() => handleToggle('isProfilePublic', !userData?.isProfilePublic)}
                />
                <ToggleItem
                    icon={User}
                    label="Show Phone Number"
                    checked={userData?.showPhone || false}
                    onToggle={() => handleToggle('showPhone', !userData?.showPhone)}
                />
                <div className="h-px bg-gray-50 dark:bg-gray-800 my-2"></div>
                <MenuItem icon={FileText} label="Terms of Service" />
                <MenuItem icon={Shield} label="Privacy Policy" />
            </div>
        </>
    );
};

export const WishlistView = ({ onBack, savedPlaceIds, allPlaces }) => {
    const savedPlaces = allPlaces ? allPlaces.filter(p => savedPlaceIds && savedPlaceIds.includes(p.id)) : [];

    return (
        <>
            <SubViewHeader title="Wishlist" onBack={onBack} />
            {savedPlaces.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center mt-10">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                        <Heart className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Save places you want to visit by tapping the heart icon on any experience.
                    </p>
                </div>
            ) : (
                <div className="p-4 grid grid-cols-1 gap-4">
                    {savedPlaces.map(place => (
                        <div key={place.id} className="relative">
                            <PlaceCard place={place} onClick={() => { }} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export const HelpView = ({ onBack }) => (
    <>
        <SubViewHeader title="Help & Support" onBack={onBack} />
        <div className="mt-4 bg-white dark:bg-gray-900 transition-colors duration-200">
            <MenuItem icon={HelpCircle} label="FAQs" />
            <MenuItem icon={Phone} label="Contact Support" />
            <MenuItem icon={ExternalLink} label="Visit Website" />
        </div>
    </>
);

export const AboutView = ({ onBack }) => (
    <>
        <SubViewHeader title="About App" onBack={onBack} />
        <div className="p-6 text-center">
            <div className="w-20 h-20 bg-orange-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-orange-200 dark:shadow-none">
                <h1 className="text-3xl font-bold text-white">M</h1>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mysuru Marga</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Version 1.0.0</p>
            <p className="text-gray-600 dark:text-gray-300 mt-6 text-sm leading-relaxed">
                Mysuru Marga is your digital companion for exploring the heritage city of Mysore.
                Discover hidden gems, local artisans, and authentic culinary experiences curated just for you.
            </p>
            <div className="mt-8 text-xs text-gray-400 dark:text-gray-600">
                Â© 2025 Mysuru Marga. All rights reserved.
            </div>
        </div>
    </>
);

export const FeedbackView = ({ onBack, userData }) => (
    <>
        <SubViewHeader title="Feedback" onBack={onBack} />
        <div className="p-4">
            <FeedbackSection userEmail={userData?.email || 'Anonymous'} />
        </div>
    </>
);

// Helper Components

export const SubViewHeader = ({ title, onBack }) => (
    <div className="bg-white dark:bg-gray-900 px-4 py-4 flex items-center shadow-sm sticky top-0 z-10 border-b dark:border-gray-800 transition-colors duration-200">
        <button onClick={onBack} className="mr-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
    </div>
);

export const MenuItem = ({ icon: _Icon, label, value, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors">
        <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 text-gray-600 dark:text-gray-400">
                <_Icon className="w-4 h-4" />
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-medium">{label}</span>
        </div>
        <div className="flex items-center">
            {value && <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">{value}</span>}
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
        </div>
    </button>
);

export const ToggleItem = ({ icon: _Icon, label, defaultChecked, checked, onToggle }) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked || false);

    // Use controlled state if checked/onToggle provided, else internal state
    const isChecked = onToggle ? checked : internalChecked;
    const toggleHandler = onToggle ? onToggle : () => setInternalChecked(!internalChecked);

    return (
        <div className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-50 dark:border-gray-800 transition-colors">
            <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 text-gray-600 dark:text-gray-400">
                    <_Icon className="w-4 h-4" />
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">{label}</span>
            </div>
            <button
                onClick={toggleHandler}
                className={`w-11 h-6 rounded-full relative transition-colors ${isChecked ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${isChecked ? 'translate-x-full left-0.5' : 'left-0.5'}`}></div>
            </button>
        </div>
    );
};

