import React, { useState } from 'react';
import { GITHUB, GOOGLE } from 'constants/constant';
import { authService } from '../../firebase';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import styled from 'styled-components';
import AuthForm from './components/AuthForm';
import AuthSocialLogin from './components/AuthSocialLogin';
import TopBar from 'components/TopBar';

export default function Auth() {
  const [isCreate, setIsCreate] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const onSocialClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = e;
    let provider;
    if (name === GOOGLE) {
      provider = new GoogleAuthProvider();
    } else if (name === GITHUB) {
      provider = new GithubAuthProvider();
    }
    provider && (await signInWithPopup(authService, provider));
  };
  const onCreateClick = () => {
    setIsCreate((prev) => !prev);
  };
  const onLoginClick = () => {
    setIsLogin((prev) => !prev);
  };
  return (
    <>
      {(isCreate || isLogin) && <Overlay />}
      <Container>
        <div>
          <TopBar />
          <FormContainer>
            <LoginSelectBox>
              <AuthSocialLogin
                name={GOOGLE}
                onSocialClick={onSocialClick}
                title="Google"
                imageSrc=""
              />
            </LoginSelectBox>
            <OrLine>
              <Line />
              또는
              <Line />
            </OrLine>
            <CreateId onClick={onCreateClick}>이메일 주소로 가입하기</CreateId>
            <Already>이미 가입하셨나요?</Already>
            <LoginId onClick={onLoginClick}>로그인</LoginId>
            {isCreate && <AuthForm close={setIsCreate} newCount={true} />}
            {isLogin && <AuthForm close={setIsLogin} newCount={false} />}
          </FormContainer>
          <ImageContainer>
            <div>
              <img src={process.env.PUBLIC_URL + '/images/mainmood.jpeg'} />
            </div>
          </ImageContainer>
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  padding: 40px;
  box-sizing: border-box;
  background-image: linear-gradient(to top, #fbc7d4, #c59de6, #9897f0);
  @media only screen and (max-width: 1024px) {
    padding-top: 200px;
  }
  > div {
    display: flex;
    width: 100%;
    height: 100%;
    border: 1px solid #111;
    background-color: #fff;
    border-radius: 10px;
    position: relative;
    box-shadow: 7px 7px #111;
    overflow: hidden;
  }
`;

const ImageContainer = styled.div`
  background-position: center;
  background-size: cover;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  > div:nth-child(1) {
    border-radius: 15px;
    overflow: hidden;
    max-width: 500px;
    height: 70%;
    position: relative;
    margin: 0 auto;
    border: 1px solid #111;
    img {
      width: 100%;
      display: block;
    }
  }
  @media only screen and (max-width: 1024px) {
    order: 2;
  }
`;

const FormContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 1024px) {
    padding-left: 5%;
    width: 90%;
    padding-right: 8%;
  }
`;

const LoginSelectBox = styled.div``;

const ProducutMessage = styled.span`
  font-size: 6em;
  font-weight: 600;
  margin-bottom: 50px;
  @media only screen and (max-width: 768px) {
    font-size: 4em;
  }
`;

const NowCreateText = styled.span`
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 85px;
  @media only screen and (max-width: 768px) {
    font-size: 2em;
  }
`;

const OrLine = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6em;
  margin-bottom: 10px;
`;

const Line = styled.div`
  width: 130px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
`;

const BaseButton = styled.div`
  width: 300px;
  height: 40px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6em;
  background-color: ${({ theme }) => theme.mainBlueColor};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-weight: 600;
  &:hover {
    background-color: ${({ theme }) => theme.mainHoverBlueColor};
    transition: all 0.3s ease-in-out;
  }
`;

const CreateId = styled(BaseButton)`
  background-color: #9897ea;
  border: 1px solid #fff;
  color: white;
  margin-bottom: 60px;
  &:hover {
    background-color: ${({ theme }) => theme.mainHoverBlueColor};
  }
`;

const LoginId = styled(BaseButton)`
  background-color: white;
  color: #9897ea;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-bottom: 45px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    color: #111;
  }
`;

const Already = styled.span`
  font-size: 2em;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Overlay = styled.div`
  @media only screen and (min-width: 768px) {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    z-index: 2;
  }
`;
