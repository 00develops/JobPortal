import React, { useEffect, useState } from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import TableList from "@/components/table/TableList";
import { createRoot } from "react-dom/client";
import { TbDotsVertical, TbEdit, TbTrash } from "react-icons/tb";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category
  const handleDelete = async (id) => {
  if (!id) return console.error("Invalid category ID");
  if (!window.confirm("Are you sure you want to delete this category?")) return;

  try {
    console.log("Deleting category ID:", id); // Debug
    const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/categories/${id}`);
    alert(res.data.message || "Category deleted successfully");
    fetchCategories(); // Refresh after delete
  } catch (err) {
    console.error("Delete error:", err.response || err);
    alert(err.response?.data?.message || "Failed to delete category");
  }
};
  const columns = [
    { title: "Name", data: "categoryName" },
    { title: "SKU", data: "categorySKU" },
    {
      title: "Status",
      data: "categoryStatus",
      createdCell: (td, cellData) => {
        td.innerHTML = cellData === 0 ? "Active" : cellData === 1 ? "Inactive" : "Deleted";
      },
    },
    {
      title: "Image",
      data: "categoryImage",
      orderable: false,
      createdCell: (td, cellData) => {
        if (cellData) {
          const imgUrl = `${import.meta.env.VITE_BASE_URL}${cellData}`;
          td.innerHTML = `<img src="${imgUrl}" alt="img" width="50"/>`;
        } else td.innerHTML = "";
      },
    },
    {
      title: "Actions",
      data: null,
      orderable: false,
      createdCell: (td, cellData, rowData) => {
        td.innerHTML = "";
        const root = createRoot(td);
        root.render(
          <Dropdown align="end" className="text-muted">
            <Dropdown.Toggle variant="link" className="drop-arrow-none p-0">
              <TbDotsVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => navigate(`/admin/category/edit/${rowData._id}`, { state: rowData })}
              >
                <TbEdit className="me-1" /> Edit
              </Dropdown.Item>
              <Dropdown.Item
                className="text-danger"
               onClick={() => handleDelete(rowData._id)}>
                <TbTrash className="me-1" /> Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Container fluid>
      <Row>
        <Col>
          <TableList
            data={categories}
            columns={columns}
            options={{ responsive: true, pageLength: 10 }}
            className="table table-striped dt-responsive w-100"
            loading={loading}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryList;
