import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import { API_URL } from '../config';

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: []
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${API_URL}/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.data) {
                throw new Error('Employee not found');
            }

            const employee = response.data;
            setFormData({
                name: employee.name,
                email: employee.email,
                mobile: employee.mobile,
                designation: employee.designation,
                gender: employee.gender,
                course: employee.course || []
            });
            setError('');
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Error fetching employee');
            setLoading(false);
            if (error.response?.status === 401) {
                navigate('/login');
            } else if (error.response?.status === 404) {
                navigate('/employees');
            }
        }
    };

    const validateForm = () => {
        try {
            if (!formData.name || !formData.email || !formData.mobile || !formData.gender) {
                throw new Error('All fields are required');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                throw new Error('Invalid email format');
            }

            const mobileRegex = /^\d{10}$/;
            if (!mobileRegex.test(formData.mobile)) {
                throw new Error('Mobile number must be 10 digits');
            }

            return true;
        } catch (error) {
            setError(error.message);
            return false;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCourseChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            course: checked
                ? [...prev.course, value]
                : prev.course.filter(course => course !== value)
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
            setImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (!validateForm()) {
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'course') {
                    formData[key].forEach(course => {
                        formDataToSend.append('course[]', course);
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });
            if (image) {
                formDataToSend.append('image', image);
            }

            await axios.put(`${API_URL}/employees/${id}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/employees');
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Error updating employee');
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center">Loading...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile</label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                pattern="[0-9]{10}"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Designation</label>
                            <select
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            >
                                <option value="">Select Designation</option>
                                <option value="HR">HR</option>
                                <option value="Manager">Manager</option>
                                <option value="Sales">Sales</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <div className="mt-2 space-x-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="M"
                                        checked={formData.gender === 'M'}
                                        onChange={handleChange}
                                        className="form-radio"
                                        required
                                    />
                                    <span className="ml-2">Male</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="F"
                                        checked={formData.gender === 'F'}
                                        onChange={handleChange}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">Female</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Course</label>
                            <div className="mt-2 space-x-4">
                                {['MCA', 'BCA', 'BSC'].map(course => (
                                    <label key={course} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            value={course}
                                            checked={formData.course.includes(course)}
                                            onChange={handleCourseChange}
                                            className="form-checkbox"
                                        />
                                        <span className="ml-2">{course}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image Upload</label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleImageChange}
                                className="mt-1 block w-full"
                            />
                            <p className="mt-1 text-sm text-gray-500">Leave empty to keep current image</p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Update Employee
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditEmployee;
