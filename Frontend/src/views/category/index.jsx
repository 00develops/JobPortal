import ComponentCard from '@/components/ComponentCard';
import AddCategory from './components/AddCategory';
import CategoryList from './components/CategoryList';

import { Col, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { TbBriefcase, TbHome, TbInfoCircle, TbMail, TbSettings, TbUser, TbUserCircle } from 'react-icons/tb';

const Page = () => {
   return <>
          <ComponentCard title="Category" isCollapsible className="mt-4">
           
            <TabContainer defaultActiveKey="Category-List">
                <Nav className="nav-tabs nav-bordered mb-3">
                    <NavItem>
                        <NavLink eventKey="Category-List" id='1'>
                            Category List
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink eventKey="Add-Category" >
                            Add Category
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent>
                    <TabPane eventKey="Category-List" >
                       <CategoryList/>
                    </TabPane>
                    <TabPane eventKey="Add-Category" >
                        <AddCategory/>
                    </TabPane>
                </TabContent>
            </TabContainer>
          </ComponentCard>
        </>;
};
export default Page;