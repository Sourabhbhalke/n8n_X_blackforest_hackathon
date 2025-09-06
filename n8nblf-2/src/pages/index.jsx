import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import CreateProject from "./CreateProject";

import UploadPhotos from "./UploadPhotos";

import BuyerPreferences from "./BuyerPreferences";

import ProjectDetail from "./ProjectDetail";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    CreateProject: CreateProject,
    
    UploadPhotos: UploadPhotos,
    
    BuyerPreferences: BuyerPreferences,
    
    ProjectDetail: ProjectDetail,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/CreateProject" element={<CreateProject />} />
                
                <Route path="/UploadPhotos" element={<UploadPhotos />} />
                
                <Route path="/BuyerPreferences" element={<BuyerPreferences />} />
                
                <Route path="/ProjectDetail" element={<ProjectDetail />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}