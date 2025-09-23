import ComponentCard from '@/components/ComponentCard';

import { Link } from "react-router-dom";
import SubCategoryList from './components/SubCategoryList';

import { Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { TbBriefcase, TbHome, TbInfoCircle, TbMail, TbSettings, TbUser, TbUserCircle } from 'react-icons/tb';

const Page = () => {
    return <>
        <div className="mt-2 pb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Sub Category List</h5>
                <Link to="/admin/sub-category/add" className="btn btn-sm btn-primary">
                    + Add Sub Category
                </Link>
            </div>

            <TabContainer defaultActiveKey="Category-List">
                <Nav className="nav-tabs nav-bordered mb-3">
                    <NavItem>
                        <NavLink eventKey="Category-List" id='1'>
                           Sub Category List
                        </NavLink>
                    </NavItem>

                </Nav>
                <TabContent>
                    <TabPane eventKey="Category-List" >
                        <SubCategoryList />
                    </TabPane>
                </TabContent>
            </TabContainer>
        </div >
    </>;
};
export default Page;