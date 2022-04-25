import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Company from './components/pages/company/Company';
import Contact from './components/pages/contact/Contact';
import Home from './components/pages/home/Home';
import NewProject from './components/pages/newProject/NewProject';

import Container from './components/layout/container/Container';
import Navbar from './components/layout/navbar/Navbar';
import Footer from './components/layout/footer/Footer';
import Projects from './components/pages/project/Projects';
import Project from './components/pages/project/Project';

function App() {
  return (
    <Router>
     <Navbar/>
      <Container custonClass="min-height">
        <Routes>
          <Route exact path="/" element={<Home />}/>
          <Route path="/company" element={<Company />}/>
          <Route path="/contact" element={<Contact />}/>
          <Route path="/newproject" element={<NewProject />}/>
          <Route path="/projects" element={<Projects />}/>
          <Route path="/project/:id" element={<Project />}/>
        </Routes>
      </Container>

      <Footer/>
    </Router>
  )
}

export default App;
