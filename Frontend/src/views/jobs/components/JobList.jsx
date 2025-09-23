import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Dropdown, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { TbDotsVertical, TbEdit, TbTrash } from "react-icons/tb";
import TableList from "@/components/table/TableList";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
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
      fetchJobs(); // Refresh table
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to delete job.");
      setVariant("danger");
    }
  };

  // Define DataTable columns
  const columns = [
    { title: "Sector", data: "sector" },
    { title: "Department", data: "department" },
    { title: "Post", data: "postName" },
    { title: "Vacancies", data: "totalVacancies" },
    {
      title: "Age Limit",
      data: "ageLimit",
      render: (cellData) =>
        cellData ? `${cellData.min}-${cellData.max}` : "N/A",
    },
    { title: "Qualification", data: "qualification" },
    {
      title: "Reservation",
      data: "categoryReservation",
      render: (cellData) =>
        cellData?.length ? cellData.join(", ") : "N/A",
    },
    { title: "Location", data: "jobLocation" },
    {
      title: "Process",
      data: "selectionProcess",
      render: (cellData) =>
        cellData?.length ? cellData.join(" → ") : "N/A",
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
                  navigate(`/admin/jobs/edit/${rowData._id}`, { state: rowData })
                }
              >
                <TbEdit className="me-1" /> Edit
              </Dropdown.Item>
              <Dropdown.Item
                className="text-secondary"
                onClick={() => navigate(`/admin/jobs/view/${rowData._id}`, { state: rowData })}
              >
                <TbTrash className="me-1" /> View
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
