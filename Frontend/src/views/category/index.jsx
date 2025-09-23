import ComponentCard from '@/components/ComponentCard';
import AddCategory from './components/AddCategory';
import { Link } from "react-router-dom";
import CategoryList from './components/CategoryList';

import { Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { TbBriefcase, TbHome, TbInfoCircle, TbMail, TbSettings, TbUser, TbUserCircle } from 'react-icons/tb';

const Page = () => {
    return <>
        <div className="mt-2 pb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Category List</h5>
                <Link to="/admin/category/add" className="btn btn-sm btn-primary">
                    + Add Category
                </Link>
            </div>

            <TabContainer defaultActiveKey="Category-List">
                <Nav className="nav-tabs nav-bordered mb-3">
                    <NavItem>
                        <NavLink eventKey="Category-List" id='1'>
                            Category List
                        </NavLink>
                    </NavItem>

                </Nav>
                <TabContent>
                    <TabPane eventKey="Category-List" >
                        <CategoryList />
                    </TabPane>
                </TabContent>
            </TabContainer>
        </div >
    </>;
};
export default Page;