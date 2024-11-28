import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import { API_URL } from '../config';

const CreateEmployee = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: 'HR',
        gender: '',
        course: []
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

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
        if (file) {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                setError('Only JPG/PNG files are allowed');
                return;
            }
            setImage(file);
            setError('');
        }
    };

    const validateForm = () => {
        try {
            if (!formData.name || !formData.email || !formData.mobile || !formData.gender || !image) {
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
            formDataToSend.append('image', image);

            await axios.post(`${API_URL}/employees`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/employees');
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Error creating employee');
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">Create Employee</h2>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile</label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Designation</label>
                            <select
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
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
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Create Employee
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreateEmployee;
