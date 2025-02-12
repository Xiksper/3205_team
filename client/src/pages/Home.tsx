import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button, Container, Form, Table } from "react-bootstrap";

interface Link {
  shortUrl: string;
  originalUrl: string;
  expiresAt: string | null;
  createdAt: string;
}

const BASE_URL = "http://localhost:5000";

const Home = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await axios.get<Link[]>(`${BASE_URL}/getLinks`);
      setLinks(res.data);
    } catch (error) {
      setError("Ошибка при загрузке ссылок.");
    }
  };

  const handleShorten = async () => {
    if (!originalUrl.trim()) {
      setError("Введите корректный URL.");
      return;
    }

    try {
      const res = await axios.post<{ shortUrl: string }>(`${BASE_URL}/shorten`, {
        originalUrl,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        alias: alias || null,
      });
      setShortUrl(`${BASE_URL}/${res.data.shortUrl}`);
      setError(null);
      fetchLinks();
    } catch (error) {
      setError("Ошибка при создании ссылки. Возможно, alias уже занят.");
    }
  };

  const handleDelete = async (shortUrl: string) => {
    try {
      await axios.delete(`${BASE_URL}/delete/${shortUrl}`);
      fetchLinks();
    } catch (error) {
      setError("Ошибка при удалении ссылки.");
    }
  };

  const handleAnalytics = (shortUrl: string) => {
    navigate(`/analytics?shortUrl=${shortUrl}`);
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center">Сокращение URL</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form className="mb-3">
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Введите URL"
            value={originalUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOriginalUrl(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="datetime-local"
            placeholder="Срок действия (необязательно)"
            value={expiresAt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExpiresAt(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Введите alias (необязательно)"
            value={alias}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAlias(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleShorten}>
          Сократить
        </Button>
      </Form>

      {shortUrl && <Alert variant="success">Ваша короткая ссылка: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></Alert>}

      <h2 className="text-center mt-4">Список сокращенных ссылок</h2>
      {links.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Короткая ссылка</th>
              <th>Оригинальный URL</th>
              <th>Срок действия</th>
              <th>Создана</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.shortUrl}>
                <td>
                  <a href={`${BASE_URL}/${link.shortUrl}`} target="_blank" rel="noopener noreferrer">
                    {`${BASE_URL}/${link.shortUrl}`}
                  </a>
                </td>
                <td>{link.originalUrl}</td>
                <td>{link.expiresAt ? new Date(link.expiresAt).toLocaleString() : "Не задан"}</td>
                <td>{new Date(link.createdAt).toLocaleString()}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(link.shortUrl)}>Удалить</Button>
                  <Button variant="info" size="sm" className="ms-2" onClick={() => handleAnalytics(link.shortUrl)}>Аналитика</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="warning">Нет сокращенных ссылок</Alert>
      )}
    </Container>
  );
};

export default Home;
