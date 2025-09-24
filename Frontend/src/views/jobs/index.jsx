
import { Link } from "react-router-dom";
import JobList from './components/JobList';
import {  Nav, NavItem, NavLink, Row, TabContainer,Card, TabContent, TabPane } from 'react-bootstrap';
import ComponentCard from "../../components/ComponentCard";

const Page = () => {
    return <>
        <div className="mt-4 pb-3">
           

            <TabContainer defaultActiveKey="Job-List">
                <Nav className="nav-tabs nav-bordered mb-3">
                    <NavItem>
                        <NavLink eventKey="Job-List" id='1'>
                            Job List
                        </NavLink>
                    </NavItem>

                </Nav>
                <ComponentCard className="pb-2" title="List"
                isLink={<Link to="/admin/jobs/add" >
                    + Add Job
                </Link>}
                >
                    <TabPane eventKey="Job-List" >
                        <JobList />
                    </TabPane>
                </ComponentCard>
            </TabContainer>
        </div>
    </>;
};
export default Page;