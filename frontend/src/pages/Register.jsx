import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import "../assets/css/Register.css";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setError('');
        setLoading(true);
        
        try {
            // Simple register call
            await api.register(email, password);
            
            // Redirect to login
            navigate('/login', { 
                state: { message: 'Registration successful! Please login.' } 
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="logo">
                    <img src="/logo.png" alt="Site Logo" />
                    <h1>Your Store</h1>
                </div>
                <p>Join us today and discover amazing products!</p>
            </div>
            <div className="auth-right">
                <h2>Create Account</h2>
                {error && <div className="auth-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Enter your email"
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Create a password"
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label>Confirm Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="Confirm your password"
                            required 
                            disabled={loading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <div className="auth-link">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register; 