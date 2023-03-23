import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authService, storageService } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import {
  GUEST_ICON,
  GUEST_NAME,
  HOME_URL,
  PROFILE_IMG,
} from 'constants/constant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faX } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import { onEnterPress } from 'utils/utilFn';
import Navigation from 'components/Navigation';
import TopBar from 'components/TopBar';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  padding: 40px;
  box-sizing: border-box;
  overflow: hidden;
  background-image: linear-gradient(to top, #fbc7d4, #c59de6, #9897f0);
`;

const ContainerBox = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  border: 1px solid #111;
  border-radius: 10px;
  box-shadow: 7px 7px #111;
  position: relative;
`;

const Logout = styled.button`
  width: 80px;
  height: 30px;
  border-radius: 15px;
  color: red;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  border: ${({ theme }) => theme.baseBorderStyle};
  transition: all 0.2s ease-in-out;
  margin-top: 20px;
  left: 0;
  right: 0;
  margin: 0 auto;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const Form = styled.form``;

const PhotoWrapper = styled.div`
  display: flex;
  width: 10%;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 30%;
  left: 3%;
`;

const Photo = styled.img`
  width: 100%;
  border-radius: 20px;
  margin-bottom: 20px;
  border: 1px solid #111;
`;

const Button = styled.button`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: rgba(0, 0, 0, 0.8);
  top: 15px;
  left: 15px;
  transition: all 0.1s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

const Input = styled.input`
  padding: 10px;
  box-sizing: border-box;
  border-radius: 25px;
  border: 1px solid #111;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const BackImg = styled.div`
  width: 600px;
  height: 200px;
  background-color: #cfd9de;
  position: absolute;
  z-index: 0;
`;

const PhotoInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const UserImg = styled.img`
  width: 135px;
  height: 135px;
  border-radius: 50%;
  border: 1px solid #111;
  margin-bottom: 20px;
  z-index: 2;
`;

const UserInfo = styled.span`
  font-size: 2em;
  font-weight: bold;
  text-align: center;
`;

const Label = styled.label`
  width: 40px;
  height: 40px;
  cursor: pointer;
  position: absolute;
  top: -90px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #a4a2f3;
  border-radius: 50%;
  border: 1px solid #111;
  color: #fff;
`;

const SubmitInput = styled.input<{ isMessage: boolean }>`
  display: block;
  border: 1px solid #111;
  width: 80px;
  height: 30px;
  border-radius: 15px;
  margin-left: auto;
  color: #fff;
  font-weight: 600;
  font-size: 1.2em;
  cursor: pointer;
  background-color: #a4a2f3;
`;

const EditWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  position: relative;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

interface IProfileProps {
  userObj: any;
  refreshUser: () => void;
}

export default function Profile({ userObj, refreshUser }: IProfileProps) {
  const userName = userObj.displayName ? userObj.displayName : GUEST_NAME;
  const [newDisplayName, setNewDisplayName] = useState(userName);
  const [profileImg, setProfileImg] = useState(``);
  const profileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const onLogoutClick = () => {
    authService.signOut();
    navigate(HOME_URL);
  };

  const onClearPhoto = () => {
    if (!profileRef.current?.value) return;
    profileRef.current.value = '';
    setProfileImg('');
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userName === newDisplayName && profileImg === '') {
      return;
    }
    let profileURL = '';
    if (profileImg !== '') {
      const fileRef = ref(
        storageService,
        `${userObj.uid}/${PROFILE_IMG}/${uuidv4()}`
      );
      const response = await uploadString(fileRef, profileImg, 'data_url');
      profileURL = await getDownloadURL(response.ref);
    }
    await updateProfile(userObj, {
      displayName: newDisplayName,
      photoURL: profileURL !== '' ? profileURL : userObj.photoURL,
    });
    refreshUser();
    onClearPhoto();
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDisplayName(e.target.value);
  };

  const onProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) return;
    const imageFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (e: any) => {
      const {
        currentTarget: { result },
      } = e;
      setProfileImg(result);
    };
    reader.readAsDataURL(imageFile);
  };
  return (
    <Container>
      <ContainerBox>
        <TopBar></TopBar>
        <Navigation userObj={userObj} />
        {/* <BackImg /> */}
        <FormWrapper>
          <UserImg
            src={userObj.photoURL !== null ? userObj.photoURL : GUEST_ICON}
          />
          <Wrapper>
            <UserInfo>
              {userObj.displayName ? userObj.displayName : GUEST_NAME}
            </UserInfo>
            <EditWrapper>
              <Form
                onSubmit={onSubmit}
                onKeyPress={(e) => onEnterPress(e, onSubmit)}
              >
                <InputWrapper>
                  <Input
                    onChange={onChange}
                    type="text"
                    placeholder="Display Name"
                    value={newDisplayName}
                  />

                  <Label htmlFor="profile_id">
                    <FontAwesomeIcon size="2x" icon={faImage} />
                    <PhotoInput
                      ref={profileRef}
                      type="file"
                      accept="image/*"
                      onChange={onProfileImage}
                      id="profile_id"
                    />
                  </Label>
                </InputWrapper>
                <SubmitInput
                  isMessage={userName !== newDisplayName || profileImg !== ''}
                  type="submit"
                  value="Save"
                />
              </Form>
            </EditWrapper>
          </Wrapper>

          {profileImg && (
            <PhotoWrapper>
              <Photo src={profileImg} />
              <Button onClick={onClearPhoto}>
                <FontAwesomeIcon color="white" icon={faX} />
              </Button>
            </PhotoWrapper>
          )}
        </FormWrapper>
      </ContainerBox>
    </Container>
  );
}
