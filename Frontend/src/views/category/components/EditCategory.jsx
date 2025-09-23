import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const EditCategory = () => {
    const location = useLocation();
    const rowData = location.state;

    const [categoryName, setCategoryName] = useState("");
    const [categorySKU, setCategorySKU] = useState("");
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('success');
    const [categoryStatus, setCategoryStatus] = useState(0);
    const [categoryImage, setCategoryImage] = useState(null); // new file input
    const [preview, setPreview] = useState(""); // preview image URL

    useEffect(() => {
        if (rowData) {
            setCategoryName(rowData.categoryName || "");
            setCategorySKU(rowData.categorySKU || "");
            setCategoryStatus(rowData.categoryStatus || 0);
            if (rowData.categoryImage) {
                setPreview(`${import.meta.env.VITE_BASE_URL}${rowData.categoryImage}`);
            }
        }
    }, [rowData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setCategoryImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("categoryName", categoryName);
        formData.append("categorySKU", categorySKU);
        formData.append("categoryStatus", categoryStatus);
        if (categoryImage) {
            formData.append("categoryImage", categoryImage);
        }

        try {
            await axios.put(
                `${import.meta.env.VITE_BASE_URL}/api/categories/${rowData._id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setMessage(`Category "${response.data.categoryName}" added successfully!`);
            setVariant('success');

            // optionally navigate back to category list
        } catch (err) {
            setMessage(error.response?.data?.message || 'Error adding category.');
            setVariant('danger');

        }
    };

    return (
        <div className="container mt-4">
            {message && <Alert variant={variant}>{message}</Alert>}
            <h3>Edit Category</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Category Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Category SKU</label>
                    <input
                        type="text"
                        className="form-control"
                        value={categorySKU}
                        onChange={(e) => setCategorySKU(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                        className="form-select"
                        value={categoryStatus}
                        onChange={(e) => setCategoryStatus(Number(e.target.value))}
                    >
                        <option value={0}>Active</option>
                        <option value={1}>Inactive</option>
                        <option value={2}>Deleted</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Category Image</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-2"
                            style={{ width: "100px", height: "auto" }}
                        />
                    )}
                </div>

                <button type="submit" className="btn btn-primary">
                    {' Update Category'}
                </button>
            </form>
        </div>
    );
};

export default EditCategory;
