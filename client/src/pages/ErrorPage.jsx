import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    width: 40%;
    padding: 50px;
    background-color: white;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
`;

const ErrorIcon = styled.div`
    font-size: 80px;
    color: #ff6b6b;
    margin-bottom: 20px;
`;

const ErrorTitle = styled.h1`
    font-family: 'Belleza', sans-serif;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
`;

const ErrorMessage = styled.p`
    font-size: 18px;
    color: #666;
    margin-bottom: 30px;
    line-height: 1.6;
`;

const StyledLink = styled(Link)`
    width: 200px;
    text-align: center;
    padding: 15px 30px;
    font-size: 16px;
    background: linear-gradient(to right, #60d4e6, #d66efd);
    border-radius: 25px;
    color: white;
    font-weight: bold;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(96, 212, 230, 0.4);
    }
`;

const ErrorPage = () => {
    return (
        <Container>
            <Wrapper>
                <ErrorIcon>⚠️</ErrorIcon>
                <ErrorTitle>Login Failed</ErrorTitle>
                <ErrorMessage>
                    Sorry, we can't log you in. Please check your credentials and try again.
                </ErrorMessage>
                <StyledLink to="/login">Try Again</StyledLink>
            </Wrapper>
        </Container>
    );
};

export default ErrorPage;