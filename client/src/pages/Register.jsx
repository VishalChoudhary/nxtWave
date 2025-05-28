import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../redux/apiCall';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.3)),
        url("/images/signupbg.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    width: 90%;
    max-width: 400px;
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    font-family: 'Belleza', sans-serif;
    font-size: 24px;
    margin-bottom: 30px;
`;

const Form = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Box = styled.div`
    display: flex;
    flex-direction: column;
`;


const Input = styled.input`
    padding: 10px;
    border: none;
    border-bottom: 1px solid gray;
    border-radius: 4px;
    outline: none;
    font-size: 14px;
`;


const FileInput = styled.input`
    display: inline-block;
`;

const Error = styled.span`
    font-size: 12px;
    color: red;
    margin-top: 5px;
`;

const Button = styled.button`
    width: 100%;
    border: none;
    padding: 15px;
    background: linear-gradient(to right, #60d4e6, #d66efd);
    border-radius: 25px;
    color: white;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    &:hover {
        background-color: #5aacc8;
    }
`;

const FooterBox = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
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


const PlaceholderText = styled.span`
    font-size: 10px;
    color: #383535;
`;

const Row = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 10px;
`;

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        age: '',
        dateOfBirth: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const dispatch = useDispatch();
    const { currentUser, isFetching, error } = useSelector(state => state.user);
    const navigate = useNavigate();

    // Prevent access if user is already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8;
        
        return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 1000 * 1024; // 1000KB

    if (file) {
        const isValidType = file.type === 'image/jpeg' || file.type === 'image/png';

            if (!isValidType) {
                setValidationErrors(prev => ({
                    ...prev,
                    profileImage: 'Please select a JPG or PNG image'
                }));
                return;
            }

            if (file.size > maxSize) {
                setValidationErrors(prev => ({
                    ...prev,
                    profileImage: 'Profile image must be less than 1000KB'
                }));
                return;
            }

            // If valid type and size
            setProfileImage(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);

            // Clear previous error if any
            if (validationErrors.profileImage) {
                setValidationErrors(prev => ({
                    ...prev,
                    profileImage: ''
                }));
            }
        }
    };


    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email';
        }
        
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
            errors.password = 'Password must be 8+ characters with uppercase, lowercase, number, and special character';
        }
        
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        
        if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
        if (!formData.age || formData.age < 18) errors.age = 'Age must be 18 or above';
        if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        if (!profileImage) errors.profileImage = 'Profile image is required';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        const registrationData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'confirmPassword') {
                registrationData.append(key, formData[key]);
            }
        });
        registrationData.append('profileImage', profileImage);

        const result = await dispatch(register(registrationData));
        
        // Check if registration was successful and redirect
        if (result.type === 'user/register/fulfilled' || (result.payload && !result.error)) {
            navigate('/login');
        }
    };

    // Prevent access if user is already logged in
    if (currentUser) {
        return <p>You are already logged in!</p>
    }

    return (
        <Container>
            <Wrapper>
                <Title>Create Your Account</Title>
                <Form onSubmit={handleRegister}>
                    <Box>
                        <PlaceholderText>Full Name *</PlaceholderText>
                        <Input 
                            type='text' 
                            name='name'
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {validationErrors.name && <Error>{validationErrors.name}</Error>}
                    </Box>

                    <Box>
                        <PlaceholderText>Email Address *</PlaceholderText>
                        <Input 
                            type='email' 
                            name='email'
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {validationErrors.email && <Error>{validationErrors.email}</Error>}
                    </Box>

                    <Row>
                        <Box>
                            <PlaceholderText>Password *</PlaceholderText>
                            <Input 
                                type='password' 
                                name='password'
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            {validationErrors.password && <Error>{validationErrors.password}</Error>}
                        </Box>
                        <Box>
                            <PlaceholderText>Confirm Password *</PlaceholderText>
                            <Input 
                                type='password' 
                                name='confirmPassword'
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                            {validationErrors.confirmPassword && <Error>{validationErrors.confirmPassword}</Error>}
                        </Box>
                    </Row>

                    <Box>
                        <PlaceholderText>Company Name *</PlaceholderText>
                        <Input 
                            type='text' 
                            name='companyName'
                            value={formData.companyName}
                            onChange={handleInputChange}
                        />
                        {validationErrors.companyName && <Error>{validationErrors.companyName}</Error>}
                    </Box>

                    <Row>
                        <Box>
                            <PlaceholderText>Age *</PlaceholderText>
                            <Input 
                                type='number' 
                                name='age'
                                min='18'
                                value={formData.age}
                                onChange={handleInputChange}
                            />
                            {validationErrors.age && <Error>{validationErrors.age}</Error>}
                        </Box>
                        <Box>
                            <PlaceholderText>Date of Birth *</PlaceholderText>
                            <Input 
                                type='date' 
                                name='dateOfBirth'
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                            />
                            {validationErrors.dateOfBirth && <Error>{validationErrors.dateOfBirth}</Error>}
                        </Box>
                    </Row>

                    <Box>
                        <PlaceholderText>Profile Image (JPG/PNG only) *</PlaceholderText>
                        <FileInput 
                            type='file' 
                            accept='.jpg,.jpeg,.png'
                            onChange={handleImageChange}
                        />
                        {validationErrors.profileImage && <Error>{validationErrors.profileImage}</Error>}
                    </Box>

                    <Button type="submit" disabled={isFetching}>
                        {isFetching ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    
                    {error && <Error>Registration failed. Please try again.</Error>}
                    
                    <FooterBox>
                        <PlaceholderText>Already have an account?</PlaceholderText>
                        <Link href='/login'>Login</Link>
                    </FooterBox>
                </Form>
            </Wrapper>
        </Container>
    );
};

export default Register;