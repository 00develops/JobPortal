import ComponentCard from '@/components/ComponentCard';


import { Nav, NavItem, NavLink, TabContainer, TabContent, TabPane } from 'react-bootstrap';

const Page = () => {
  return (
    <ComponentCard className="mt-2">
      {/* Header with title + button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Category List</h5>
        <button className="btn btn-sm btn-primary">
          + Add Category
        </button>
      </div>

      {/* Tabs */}
      <TabContainer defaultActiveKey="Category-List">
        <Nav className="nav-tabs nav-bordered mb-3">
          <NavItem>
            <NavLink eventKey="Category-List" id="1">
              Category List
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink eventKey="Add-Category">
              Add Category
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent>
          <TabPane eventKey="Category-List">
       
          </TabPane>
          <TabPane eventKey="Add-Category">
           
          </TabPane>
        </TabContent>
      </TabContainer>
    </ComponentCard>
  );
};

export default Page;
