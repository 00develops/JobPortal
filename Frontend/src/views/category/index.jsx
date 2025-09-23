import ComponentCard from '@/components/ComponentCard';
import AddCategory from './components/AddCategory';
import { Link } from "react-router-dom";
import CategoryList from './components/CategoryList';

import { Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { TbBriefcase, TbHome, TbInfoCircle, TbMail, TbSettings, TbUser, TbUserCircle } from 'react-icons/tb';
import { appTitle } from '@/helpers';

const Page = () => {
    return <>
        <div className="mt-4 pb-3">
           
            <TabContainer defaultActiveKey="Category-List">
                <Nav className="nav-tabs nav-bordered mb-3">
                    <NavItem>
                        <NavLink eventKey="Category-List" id='1'>
                            Category List
                        </NavLink>
                    </NavItem>

                </Nav>
                <ComponentCard title="List"isLink={<Link to="/admin/category/add" >
                    + Add Category
                </Link>}>
                    <TabPane eventKey="Category-List" >
                        <CategoryList />
                    </TabPane>
                </ComponentCard>
            </TabContainer>
        </div >
    </>;
};
export default Page;