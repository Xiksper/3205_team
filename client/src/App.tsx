import { Link, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";

const App = () => {
  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">URL Shortener</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Главная</Nav.Link>
              <Nav.Link as={Link} to="/analytics">Аналитика</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
