import React from 'react';
import styled from 'styled-components';
import { useSelector,useDispatch } from 'react-redux';
import { logout } from '../redux/userRedux';
import { Navigate } from 'react-router-dom';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #60d4e6 0%, #d66efd 100%);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    width: 50%;
    padding: 10px;
    background-color: white;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
`;

const WelcomeTitle = styled.h1`
    font-family: 'Belleza', sans-serif;
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
    background: white;
`;

const ProfileSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px 0;
`;

const ProfileImage = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #60d4e6;
    margin-bottom: 20px;
`;

const UserDetails = styled.div`
    width: 100%;
    max-width: 400px;
`;

const DetailRow = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    margin: 10px 0;
    background-color: #f8f9fa;
    border-radius: 10px;
    border-left: 4px solid #60d4e6;
`;

const DetailLabel = styled.span`
    font-weight: bold;
    color: #555;
    font-size: 14px;
`;

const DetailValue = styled.span`
    color: #333;
    font-size: 14px;
`;

const Button = styled.button`
    width: 200px;
    border: none;
    padding: 15px 30px;
    margin-top: 30px;
    font-size: 16px;
    background: linear-gradient(to right, #60d4e6, #d66efd);
    border-radius: 25px;
    color: white;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(96, 212, 230, 0.4);
    }
`;

const ThankYou = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser);
    const isFetching = useSelector(state => state.user.isFetching);
    
    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    
    const handleLogout = () => {
        dispatch(logout());
    };
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    
    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    
    return (
        <Container>
            <Wrapper>
                <WelcomeTitle>Welcome, {currentUser.name}!</WelcomeTitle>
                <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                    Thank you for joining us. Here are your account details:
                </p>
                
                <ProfileSection>
                    {currentUser.profileImage && (
                        <ProfileImage 
                            src={`http://localhost:5000/uploads/${currentUser.profileImage}`} 
                            alt="Profile"
                        />
                    )}
                    
                    <UserDetails>
                        <DetailRow>
                            <DetailLabel>Full Name:</DetailLabel>
                            <DetailValue>{currentUser.name}</DetailValue>
                        </DetailRow>
                        
                        <DetailRow>
                            <DetailLabel>Email:</DetailLabel>
                            <DetailValue>{currentUser.email}</DetailValue>
                        </DetailRow>
                        
                        <DetailRow>
                            <DetailLabel>Company:</DetailLabel>
                            <DetailValue>{currentUser.companyName}</DetailValue>
                        </DetailRow>
                        
                        <DetailRow>
                            <DetailLabel>Age:</DetailLabel>
                            <DetailValue>{calculateAge(currentUser.dateOfBirth)} years</DetailValue>
                        </DetailRow>
                        
                        <DetailRow>
                            <DetailLabel>Date of Birth:</DetailLabel>
                            <DetailValue>{formatDate(currentUser.dateOfBirth)}</DetailValue>
                        </DetailRow>
                        
                        <DetailRow>
                            <DetailLabel>Member Since:</DetailLabel>
                            <DetailValue>{formatDate(currentUser.createdAt)}</DetailValue>
                        </DetailRow>
                    </UserDetails>
                </ProfileSection>
                
                <Button onClick={handleLogout} disabled={isFetching}>
                    Logout
                </Button>
            </Wrapper>
        </Container>
    );
};

export default ThankYou;