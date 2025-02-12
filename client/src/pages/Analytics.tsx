import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button, Container, Form, ListGroup, Spinner } from "react-bootstrap";

const BASE_URL = "http://localhost:5000";

const Analytics = () => {
  const [searchParams] = useSearchParams();
  const [shortUrl, setShortUrl] = useState("");
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [lastIps, setLastIps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const paramShortUrl = searchParams.get("shortUrl");
    if (paramShortUrl) {
      setShortUrl(`${BASE_URL}/${paramShortUrl}`);
      fetchAnalytics(paramShortUrl);
    }
  }, [searchParams]);

  const fetchAnalytics = async (fullUrl: string) => {
    const extractedShortUrl = fullUrl.split("/").pop() || "";

    if (!extractedShortUrl) {
      setError("Введите корректный короткий URL!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${BASE_URL}/analytics/${extractedShortUrl}`);
      setTotalVisits(res.data.totalVisits ?? 0);
      setLastIps(res.data.lastIps ?? []);
    } catch (err) {
      setError("Не удалось загрузить аналитику. Проверьте правильность ссылки.");
      setTotalVisits(null);
      setLastIps([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center">Аналитика</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form className="mb-3">
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Введите короткий URL"
            value={shortUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShortUrl(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={() => fetchAnalytics(shortUrl)}>Получить статистику</Button>
      </Form>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}

      {totalVisits !== null && (
        <Alert variant="info" className="text-center">
          Количество переходов: <strong>{totalVisits}</strong>
        </Alert>
      )}

      {lastIps.length > 0 && (
        <div>
          <h4>Последние 5 IP-адресов</h4>
          <ListGroup>
            {lastIps.map((ip, index) => (
              <ListGroup.Item key={index}>{ip}</ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </Container>
  );
};

export default Analytics;
