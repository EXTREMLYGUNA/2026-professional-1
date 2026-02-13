import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../service/api.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        // Check if user is authenticated
        if (!authAPI.isAuthenticated()) {
            navigate('/login');
            return;
        }

        // Get current user from localStorage
        const currentUser = authAPI.getCurrentUser();
        setUser(currentUser);

        // Fetch user profile
        fetchProfile();
    }, [navigate]);

    const fetchProfile = async () => {
        try {
            const result = await authAPI.getProfile();
            if (result.success) {
                setProfile(result.user);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authAPI.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                            <h3 className="mb-0">Dashboard</h3>
                            <button 
                                className="btn btn-light btn-sm"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                                     style={{ width: '80px', height: '80px' }}>
                                    <span className="text-white display-6">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <h2 className="mt-3">Welcome, {user?.name}!</h2>
                                <p className="text-muted">{user?.email}</p>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card mb-3">
                                        <div className="card-header bg-light">
                                            <h5 className="mb-0">User Information</h5>
                                        </div>
                                        <div className="card-body">
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <th>Name:</th>
                                                        <td>{profile?.name || user?.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Email:</th>
                                                        <td>{profile?.email || user?.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>User ID:</th>
                                                        <td>
                                                            <small className="text-muted">
                                                                {profile?._id || user?._id}
                                                            </small>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card mb-3">
                                        <div className="card-header bg-light">
                                            <h5 className="mb-0">Account Status</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="alert alert-success">
                                                <i className="bi bi-check-circle-fill me-2"></i>
                                                Account is active and verified
                                            </div>
                                            <p className="mb-2">
                                                <strong>Last Login:</strong> Just now
                                            </p>
                                            <p className="mb-0">
                                                <strong>Session:</strong> Active
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card mt-3">
                                <div className="card-header bg-light">
                                    <h5 className="mb-0">Quick Actions</h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-grid gap-2 d-md-flex">
                                        <button className="btn btn-outline-primary me-2">
                                            <i className="bi bi-person-circle me-2"></i>
                                            Edit Profile
                                        </button>
                                        <button className="btn btn-outline-secondary me-2">
                                            <i className="bi bi-shield-lock me-2"></i>
                                            Change Password
                                        </button>
                                        <button className="btn btn-outline-danger">
                                            <i className="bi bi-trash me-2"></i>
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;