import React, { useEffect, useState } from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { TbDotsVertical, TbEdit, TbTrash } from "react-icons/tb";
import TableList from "@/components/table/TableList";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/jobs`);
      setJobs(res.data || []);
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setJobs([]);
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
      fetchJobs(); // Refresh table
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  // Define DataTable columns
  const columns = [
    { title: "Sector", data: "sector" },
    { title: "Department", data: "department" },
    { title: "Post Name", data: "postName" },
    { title: "Vacancies", data: "totalVacancies" },
    {
      title: "Age Limit",
      data: "ageLimit",
      render: (cellData) =>
        cellData
          ? `${cellData.min}-${cellData.max} (as on ${cellData.referenceDate})`
          : "N/A",
    },
    { title: "Qualification", data: "qualification" },
    {
      title: "Category Reservation",
      data: "categoryReservation",
      render: (cellData) =>
        cellData?.length ? cellData.join(", ") : "N/A",
    },
    { title: "Job Location", data: "jobLocation" },
    {
      title: "Selection Process",
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
          <TableList
            id="jobs-table"
            data={jobs}
            columns={columns}
            options={{
              responsive: true,
              pageLength: 10,
              destroy: true, // re-init table when jobs change
            }}
            className="table table-striped dt-responsive w-100"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default JobList;
