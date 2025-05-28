import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, verifyOTP } from '../redux/apiCall';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(rgba(255, 255, 255, 0.205),rgba(255, 255, 255, 0.271)),
    url("/images/signupbg.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    width: 25%;
    min-height: 80%;
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.h1`
    font-family: 'Belleza', sans-serif;
    font-size: 30px;
    font-weight: 2000;
    margin-bottom: 40px;
`;

const Form = styled.form`
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-direction: column; 
    align-items: center; 
    justify-content: center;
`;

const Input = styled.input`
    flex: 1;
    height: 40%;
    width: 100%;
    margin-top: 1px;
    padding: 8px 0px;
    border-radius: 1px solid #cccc;
    border: none;
    border-bottom: 1px solid gray;
    outline: none;
`;

const Box = styled.div`
    width: 70%;
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
`;
const PlaceholderText = styled.span`
    font-size: 10px;
    color: #383535;
`;

const Button = styled.button`
    width: 50%;
    border: none;
    padding: 15px 20px;
    margin-top: 40px;
    font-size: 15px;
    background: linear-gradient(to right, #60d4e6, #d66efd);
    border-radius: 25px;
    color: white;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;

    &:hover{
        background-color: #5aacc8;
    }
`;

const FooterBox = styled.span`
    margin-top: 80px;
    font-size: 12px;
    color: #383535;
`;

const Link = styled.a`
    text-decoration: underline;
    cursor: pointer;
    font-size: 12px;
    color: gray;
    font-weight: bolder;
`;

const Error = styled.span`
    margin-top : 10px ;
    color: red;
`;

const OTPInput = styled.input`
    width: 100%;
    height: 50px;
    padding: 15px;
    border: 2px solid #60d4e6;
    border-radius: 8px;
    outline: none;
    font-size: 18px;
    text-align: center;
    letter-spacing: 8px;
    font-weight: bold;
`;

const Success = styled.span`
    margin-top: 15px;
    color: green;
    font-size: 14px;
    text-align: center;
`;

const OTPTimer = styled.div`
    margin-top: 10px;
    font-size: 12px;
    color: #666;
    text-align: center;
`;


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOTP] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const [timer, setTimer] = useState(600); // 10 minutes in seconds
    const [loginResponse, setLoginResponse] = useState(null);

    const dispatch = useDispatch();
    const { currentUser, isFetching, error } = useSelector(state => state.user);
    const navigate = useNavigate();

    // Timer countdown
    React.useEffect(() => {
        if (showOTP && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            setShowOTP(false);
            setTimer(600);
            setLoginResponse(null);
        }
    }, [showOTP, timer]);

    // Redirect if user is logged in
    React.useEffect(() => {
        if (currentUser && currentUser.accessToken) {
            navigate('/thank-you');
        }
    }, [currentUser, navigate]);

    // Cleanup timer when component unmounts
    React.useEffect(() => {
        return () => {
            // Reset states when leaving the component
            setShowOTP(false);
            setTimer(600);
            setLoginResponse(null);
        };
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await dispatch(login({ email, password }));
        
        if (result.payload && result.payload.requiresOTP) {
            setShowOTP(true);
            setTimer(600);
            setLoginResponse(result.payload);
        }
    };

    const handleOTPVerification = async (e) => {
        e.preventDefault();
        const result = await dispatch(verifyOTP({ email, otp }));
        
        if (result.payload && result.payload.accessToken) {
            navigate('/thank-you');
        }
    };

    const handleOTPChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOTP(value);
    };

    // Handle navigation to register page
    // eslint-disable-next-line
    const handleRegisterClick = () => {
        // Reset any timer states before navigating
        setShowOTP(false);
        setTimer(600);
        setLoginResponse(null);
        navigate('/register');
    };

    return (
        <Container>
            <Wrapper>
                <Title>{showOTP ? 'Enter OTP' : 'Login'}</Title>
                
                {!showOTP ? (
                    <Form onSubmit={handleLogin}>
                        <Box>
                            <PlaceholderText>Email Address</PlaceholderText>
                            <Input 
                                type='email' 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Box>
                        <Box>
                            <PlaceholderText>Password</PlaceholderText>
                            <Input 
                                type='password' 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Box>
                        <Button type="submit" disabled={isFetching}>
                            {isFetching ? 'Logging in...' : 'Login'}
                        </Button>
                        {error && <Error>{error}</Error>}
                        <FooterBox>
                            <PlaceholderText>Don't have an account?</PlaceholderText>
                            <Link href='/register'>Register</Link>
                        </FooterBox>
                    </Form>
                ) : (
                    <Form onSubmit={handleOTPVerification}>
                        <Box>
                            <PlaceholderText>Enter 6-digit OTP sent to your email</PlaceholderText>
                            <OTPInput 
                                type='text' 
                                value={otp}
                                onChange={handleOTPChange}
                                placeholder="000000"
                                maxLength="6"
                                required
                            />
                            <OTPTimer>Time remaining: {formatTime(timer)}</OTPTimer>
                            {loginResponse && loginResponse.otp && (
                                <Success>Development OTP: {loginResponse.otp}</Success>
                            )}
                        </Box>
                        <Button type="submit" disabled={isFetching || otp.length !== 6}>
                            {isFetching ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                        {error && <Error>{error}</Error>}
                    </Form>
                )}
            </Wrapper>
        </Container>
    );
};

export default Login;