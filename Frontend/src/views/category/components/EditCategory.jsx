import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TableList from "@/components/table/TableList"; // import your TableList component
import { Button } from "react-bootstrap";
import ComponentCard from "../../../components/ComponentCard";
import { TbEdit, TbTrash } from "react-icons/tb";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const handleEdit = (category) => {
    navigate("/edit-category", { state: category });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/categories/${id}`);
      fetchCategories(); // refresh table
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  // Prepare columns for TableList
  const columns = [
    { title: "Name", data: "categoryName" },
    { title: "SKU", data: "categorySKU" },
    {
      title: "Status",
      data: "categoryStatus",
      render: (data) => (data === 0 ? "Active" : "Inactive"),
    },
    {
      title: "Image",
      data: "categoryImage",
      render: (data) =>
        data ? (
          <img
            src={`${import.meta.env.VITE_BASE_URL}${data}`}
            alt="Category"
            style={{ width: "50px", height: "auto" }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Actions",
      data: null,
      orderable: false,
      render: (data, type, row) => (
        <>
          <Button
            size="sm"
            variant="warning"
            className="me-2"
            onClick={() => handleEdit(row)}
          >
            <TbEdit />
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row._id)}>
            <TbTrash />
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className=" mt-4">
      
      <ComponentCard title="Category List">
          <TableList data={categories} columns={columns} />
      </ComponentCard>
    </div>
  );
};

export default CategoryList;
