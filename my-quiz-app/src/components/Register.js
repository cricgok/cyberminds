import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import QuizzyLogo from '../assets/images/Quizzy.jpg';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://cyberminds-xhm7.onrender.com/register', { username, email, password });
      if (response.data.success) {
        alert('Registration successful');
        navigate('/login');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('There was an error registering!', error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleRegister}>
        <Logo src={QuizzyLogo} alt="Quizzy Logo" />
        <Title>Create your Quizzy account</Title>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Register</Button>
        <Divider />
        <StyledLink to="/login">Already have an account? Login</StyledLink>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  @media (min-width: 768px) {
    padding: 40px;
  }
`;

const Logo = styled.img`
  width: 80px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    width: 100px;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  margin-bottom: 20px;
  color: #202124;

  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    border-color: #4285f4;
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
    outline: none;
  }

  @media (min-width: 768px) {
    padding: 14px;
    font-size: 16px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #1a73e8;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;

  &:hover {
    background-color: #1558b6;
  }

  @media (min-width: 768px) {
    padding: 14px;
    font-size: 16px;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #dadce0;
  margin: 20px 0;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #1a73e8;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

export default Register;
