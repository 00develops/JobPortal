import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Dropdown, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { TbDotsVertical, TbEdit, TbEye, TbTrash } from "react-icons/tb";
import TableList from "@/components/table/TableList";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const navigate = useNavigate();
  const tableRef = useRef(null);

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/jobs`);
      setJobs(res.data || []);
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setJobs([]);
      setMessage("Failed to fetch jobs.");
      setVariant("danger");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Delete job
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/jobs/${id}`);
      setMessage("Job deleted successfully.");
      setVariant("success");
      setJobs((prev) => prev.filter((job) => job._id !== id)); // remove locally
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to delete job.");
      setVariant("danger");
    }
  };

  // Define DataTable columns (Basic Job Details only)
  const columns = [
    { title: "Post Name", data: "postName" },
    { title: "Organization / Department", data: "organization" },
    { title: "Job Type", data: "jobType" },
    { title: "Job Category", data: "jobCategory" },
    { title: "Job Location", data: "jobLocation" },
    { title: "Pay Scale", data: "payScale" },
    {
      title: "Actions",
      data: null,
      orderable: false,
      createdCell: (td, cellData, rowData) => {
        // Clear previous content
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
                  navigate(`/admin/jobs/view/${rowData._id}`, { state: rowData })
                }
              >
                <TbEye className="me-1" /> View
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() =>
                  navigate(`/admin/jobs/edit/${rowData._id}`, { state: rowData })
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
            data={jobs}
            columns={columns}
            options={{
              responsive: true,
              pageLength: 10,
              destroy: true, // re-init table when jobs change
              dom:
                "<'d-md-flex justify-content-between align-items-center my-2'<'dropdown'B>f>" +
                "rt" +
                "<'d-md-flex justify-content-between align-items-center mt-2'ip>",
              buttons: [
                { extend: "copyHtml5", className: "btn btn-sm btn-secondary" },
                { extend: "csvHtml5", className: "btn btn-sm btn-secondary" },
                { extend: "excelHtml5", className: "btn btn-sm btn-secondary" },
                { extend: "pdfHtml5", className: "btn btn-sm btn-secondary" },
              ],
              searching: true,
            }}
            className="table table-striped dt-responsive w-100"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default JobList;
