import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Dropdown, Alert } from "react-bootstrap";
import TableList from "@/components/table/TableList";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import {
  TbDotsVertical,
  TbEdit,
  TbTrash,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight
} from "react-icons/tb";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();
  const tableRef = useRef(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      setCategories([]);
      setMessage("Failed to fetch categories.");
      setVariant("danger");
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
      const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/categories/${id}`);
      setMessage(res.data.message || "Category deleted successfully");
      setVariant("success");
      fetchCategories(); // Refresh after delete
    } catch (err) {
      console.error("Delete error:", err.response || err);
      setMessage(err.response?.data?.message || "Failed to delete category");
      setVariant("danger");
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
        td.innerHTML = cellData
          ? `<img src="${import.meta.env.VITE_BASE_URL}${cellData}" alt="img" width="50"/>`
          : "";
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
                onClick={() =>
                  navigate(`/admin/category/edit/${rowData._id}`, { state: rowData })
                }
              >
                <TbEdit className="me-1" /> Edit
              </Dropdown.Item>
              <Dropdown.Item
                className="text-danger"
                onClick={() => handleDelete(rowData._id)}
              >
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
          {message && <Alert variant={variant}>{message}</Alert>}

          <TableList
            ref={tableRef}
            data={categories}
            columns={columns}
            options={{
              responsive: true,
              dom: `<"d-flex justify-content-between mb-2"
                      <"dt-buttons"B>
                      <"dataTables_filter"f>
                    >rtip`,
              buttons: [
                { extend: "copyHtml5", className: "btn btn-sm btn-secondary" },
                { extend: "csvHtml5", className: "btn btn-sm btn-secondary" },
                { extend: "excelHtml5", className: "btn btn-sm btn-secondary" },
                { extend: "pdfHtml5", className: "btn btn-sm btn-secondary" },
              ],
              paging: true,
              pageLength: 10,
              searching: true,
              language: {
                paginate: {
                  first: ReactDOMServer.renderToStaticMarkup(
                    <TbChevronsLeft className="fs-lg" />
                  ),
                  previous: ReactDOMServer.renderToStaticMarkup(
                    <TbChevronLeft className="fs-lg" />
                  ),
                  next: ReactDOMServer.renderToStaticMarkup(
                    <TbChevronRight className="fs-lg" />
                  ),
                  last: ReactDOMServer.renderToStaticMarkup(
                    <TbChevronsRight className="fs-lg" />
                  ),
                },
              },
            }}
            className="table table-striped dt-responsive w-100"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryList;
