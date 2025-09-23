import React, { useEffect, useState } from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import { createRoot } from 'react-dom/client';
import { TbDotsVertical, TbEdit, TbTrash } from 'react-icons/tb';
import {  Row, Col,  DropdownMenu, DropdownItem, DropdownToggle } from "react-bootstrap"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import TableList from "@/components/table/TableList";


const SubCategoryList = () => {
  const [subCategories, setSubCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch all sub-categories
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/subcategories`);
      setSubCategories(res.data || []);
    } catch (err) {
      console.error(err);
      setSubCategories([]);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  // Delete sub-category
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sub-category?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/subcategories/${id}`);
      fetchSubCategories(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  // DataTable columns
  const columns = [
    { title: 'Sub-Category Name', data: 'subCategoryName' },
    { title: 'Parent Category', data: 'parentCategory', createdCell: (td, cellData) => {
      td.innerHTML = cellData?.categoryName || '';
    }},
    {
      title: 'Image',
      data: 'subCategoryImage',
      orderable: false,
      createdCell: (td, cellData) => {
        td.innerHTML = cellData ? `<img src="${import.meta.env.VITE_BASE_URL}${cellData}" alt="img" width="50"/>` : '';
      },
    },
    {
      title: 'Actions',
      data: null,
      orderable: false,
      createdCell: (td, cellData, rowData) => {
        td.innerHTML = '';
        const root = createRoot(td);
        root.render(
          <Dropdown align="end" className="text-muted">
            <Dropdown.Toggle variant="link" className="drop-arrow-none p-0">
              <TbDotsVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => navigate(`/admin/sub-category/edit/${rowData._id}`, { state: rowData })}
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

  // Initialize DataTable
  DataTable.use(DT);

  return (
    <Container fluid >
      <Row>
          <Col>
              <TableList
                data={subCategories}
                columns={columns}
                options={{ responsive: true, pageLength: 10 }}
                className="table table-striped dt-responsive w-100"
              />
          </Col>
      </Row>
        
   
    </Container>
  );
};

export default SubCategoryList;
