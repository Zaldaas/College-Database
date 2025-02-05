import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';
import useDocumentTitle from '../hooks/useDocumentTitle';

interface Props {
  isEdit?: boolean;
}

const AdminCourseForm: React.FC<Props> = ({ isEdit = false }) => {
  const { id } = useParams();
  useDocumentTitle(isEdit ? 'Edit Course' : 'Add New Course');


  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [courseNumber, setCourseNumber] = useState('');
  const [title, setTitle] = useState('');
  const [textbook, setTextbook] = useState('');
  const [units, setUnits] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});


  useEffect(() => {
    if (isEdit && id) {
      api.get(`/courses/${id}`)
        .then(response => {
          const course = response.data;
          setCourseNumber(course.course_number);
          setTitle(course.title);
          setTextbook(course.textbook);
          setUnits(course.units);
          setDepartmentId(course.department_id);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching course:', error);
          setError('Failed to load course details.');
          setLoading(false);
        });


    }
  }, [isEdit, id]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Course number validation - must be a number
    if (!/^\d+$/.test(courseNumber)) {
      errors.courseNumber = 'Course can only contain numbers';
    }

    // Department ID validation - must be a number
    if (!/^\d+$/.test(departmentId)) {
      errors.departmentId = 'Department ID can only contain numbers';
    }

    // Units validation - must be a number
    if (!/^\d+$/.test(units) && units !== '') {
      errors.units = 'Units can only contain numbers';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;

  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    const courseData = {
      course_number: courseNumber,
      title,
      textbook,
      units: Number(units),
      department_id: Number(departmentId),
    };

    try {
      if (isEdit && id) {

        await api.put(`/courses/${id}`, courseData);
        navigate(`/admin/course/${id}`);
      } else {
        await api.post('/courses', courseData);
        navigate('/admin/courselist');
      }

    } catch (error) {
      console.error('Error saving course:', error);
      setError(`Failed to ${isEdit ? 'update' : 'create'} course. Please try again.`);
    }
  };


  const handleCourseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setCourseNumber(value);
  };


  const handleUnitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setUnits(value);
  };


  const handleDepartmentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 7);
    setDepartmentId(value);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h2 className="mb-0">{isEdit ? 'Edit Course' : 'Add New Course'}</h2>
        </Card.Header>

        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Course Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={courseNumber}
                    onChange={handleCourseNumberChange}
                    isInvalid={!!validationErrors.courseNumber}

                    required
                    placeholder="Enter course number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.courseNumber}

                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter title"

                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Textbook</Form.Label>
                  <Form.Control
                    type="text"
                    value={textbook}
                    onChange={(e) => setTextbook(e.target.value)}
                    placeholder="Enter textbook"


                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Units</Form.Label>
                  <Form.Control
                    type="text"
                    value={units}
                    onChange={handleUnitsChange}
                    placeholder="Enter units"

                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Department ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={departmentId}
                    onChange={handleDepartmentIdChange}
                    isInvalid={!!validationErrors.departmentId}
                    placeholder="Enter department ID"

                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.departmentId}
                  </Form.Control.Feedback>
                </Form.Group>

              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                {isEdit ? 'Save Changes' : 'Add Course'}
              </Button>
              <Button variant="secondary" onClick={() => navigate(`/admin/course/${id}`)}>
                Cancel

              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminCourseForm;
