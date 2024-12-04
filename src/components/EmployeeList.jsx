import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import { API_URL } from '../config';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState({ field: 'name', order: 'asc' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const limit = 10;

    useEffect(() => {
        fetchEmployees();
    }, [currentPage, search, sort]);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${API_URL}/employees`, {
                params: {
                    page: currentPage,
                    limit,
                    search,
                    sort: sort.field,
                    order: sort.order
                },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                setEmployees(response.data.employees || []);
                setTotalPages(response.data.pages || 0);
                setTotalCount(response.data.total || 0);
                setError('');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching employees');
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            if (!window.confirm('Are you sure you want to delete this employee?')) {
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            await axios.delete(`${API_URL}/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setError('');
            fetchEmployees();
        } catch (error) {
            setError(error.response?.data?.message || 'Error deleting employee');
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleSort = (field) => {
        setSort(prev => ({
            field,
            order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">
                                Employees List (Count: {totalCount})
                            </h2>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="text"
                                    placeholder="Enter search keyword"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="px-4 py-2 border rounded-md"
                                />
                                <button
                                    onClick={() => navigate('/employees/create')}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                >
                                    Create Employee
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('id')}>
                                        ID {sort.field === 'id' && (sort.order === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('name')}>
                                        Name {sort.field === 'name' && (sort.order === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('email')}>
                                        Email {sort.field === 'email' && (sort.order === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mobile
                                    </th>
                                    <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Designation
                                    </th>
                                    <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Gender
                                    </th>
                                    <th className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('createDate')}>
                                        Create Date {sort.field === 'createDate' && (sort.order === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {employees.map((employee) => (
                                    <tr key={employee._id}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{employee.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex-shrink-0 h-16 w-16">
                                                {employee.image ? (
                                                    <img
                                                        src={employee.image.startsWith('data:') 
                                                            ? employee.image 
                                                            : `${API_URL}/uploads/${employee.image}`}
                                                        alt={employee.name}
                                                        className="h-16 w-16 rounded-lg object-cover border border-gray-200 shadow-sm"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                                                        }}
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                                        <span className="text-gray-400 text-sm">No Image</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 truncate">{employee.name}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm break-words">{employee.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{employee.mobile}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm">{employee.designation}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{employee.gender}</td>
                                        <td className="px-6 py-4 whitespace-normal text-sm">{employee.course.join(', ')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {new Date(employee.createDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => navigate(`/employees/edit/${employee._id}`)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(employee._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EmployeeList;
