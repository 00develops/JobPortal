
import { Link } from "react-router-dom";
import JobList from './components/JobList';



import {  Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import { TbBriefcase, TbHome, TbInfoCircle, TbMail, TbSettings, TbUser, TbUserCircle } from 'react-icons/tb';

const Page = () => {
    return <>
        <div className="mt-2 pb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Job List</h5>
                <Link to="/admin/jobs/add" className="btn btn-sm btn-primary">
                    + Add Job
                </Link>
            </div>

            <TabContainer defaultActiveKey="Job-List">
                <Nav className="nav-tabs nav-bordered mb-3">
                    <NavItem>
                        <NavLink eventKey="Job-List" id='1'>
                            Job List
                        </NavLink>
                    </NavItem>

                </Nav>
                <TabContent>
                    <TabPane eventKey="Job-List" >
                        <JobList />
                    </TabPane>
                </TabContent>
            </TabContainer>
        </div >
    </>;
};
export default Page;