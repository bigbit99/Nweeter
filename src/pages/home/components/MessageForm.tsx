import React, { FormEvent, useRef, useState } from 'react';
import { dbService, storageService } from '../../../firebase';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import styled from 'styled-components';
import { GUEST_ICON, GUEST_NAME, MESSAGES } from 'constants/constant';
import { addDoc, collection } from 'firebase/firestore';
import { IUserObjProps } from 'utils/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faImage, faX } from '@fortawesome/free-solid-svg-icons';
import { onEnterPress } from 'utils/utilFn';

library.add(faImage, faX);

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100%;
  border-left: 1px solid #111;
  border-right: 1px solid #111;
  border-bottom: 1px solid #111;
  padding: 17px;
`;

const Home = styled.div`
  font-size: 1.6em;
  font-weight: 600;
  margin-bottom: 30px;
`;

const SubmitInput = styled.input<{ isMessage: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  width: 70px;
  height: 35px;
  border-radius: 17.5px;
  background: none;
  color: white;
  font-weight: 600;
  font-size: 1.2em;
  background-color: #9897ea;
  border: 1px solid #111;
  cursor: pointer;
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
const TextArea = styled.textarea`
  height: 55px;
  border: none;
  width: 100%;
  font-size: 1.6em;
  margin-bottom: 10px;
  resize: none;
  border-radius: 35px;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid #111;
  &::placeholder {
    font-size: 1.5em;
    border: none;
    width: 100%;
  }
  &:placeholder-shown {
    font-size: 1em;
    width: 100%;
  }
  &:focus {
    outline-width: 0;
  }
  &:-webkit-input-placeholder {
    font-size: 1.6em;
    width: 100%;
  }
  &:focus::placeholder {
    border: none;
    width: 100%;
  }
`;

const TextInput = styled.input`
  height: 55px;
  border: none;
  width: 100%;
  font-size: 1.6em;
  margin-bottom: 10px;
  &::placeholder {
    font-size: 2em;
    border: none;
    width: 100%;
  }
  &:placeholder-shown {
    font-size: 1em;
    width: 100%;
  }
  &:focus {
    outline-width: 0;
  }
  &:-webkit-input-placeholder {
    font-size: 1.6em;
    width: 100%;
  }
  &:focus::placeholder {
    border: none;
    width: 100%;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  height: 50px;
  margin-top: 60px;
  margin-bottom: 20px;
`;

const PhotoWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Photo = styled.img`
  width: 100%;
  border-radius: 20px;
  margin-bottom: 20px;
`;

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
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

const BottomNav = styled.div`
  display: flex;
  justify-content: end;
  gap: 10px;
  padding-left: 50px;
  label {
    > img {
      display: block;
      width: 20px;
      height: 20px;
    }
  }
`;

const Label = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  cursor: pointer;
  color: #111;
  box-sizing: border-box;
  border: 1px solid #111;
  border-radius: 50%;
  &:hover {
    background-color: #9897ea;
  }
`;

export default function MessageForm({ userObj }: IUserObjProps) {
  const [message, setMessage] = useState('');
  const [photoSource, setPhotoSource] = useState('');
  const photoRef = useRef<HTMLInputElement>(null);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message && photoSource === '') return;
    let photoURL = '';
    if (photoSource !== '') {
      const fileRef = ref(
        storageService,
        `${userObj.uid}/${MESSAGES}/${uuidv4()}`
      );
      const response = await uploadString(fileRef, photoSource, 'data_url');
      photoURL = await getDownloadURL(response.ref);
    }
    await addDoc(collection(dbService, MESSAGES), {
      text: message,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      userId: userObj.displayName ? userObj.displayName : GUEST_NAME,
      userImage: userObj.photoURL !== null ? userObj.photoURL : GUEST_ICON,
      photoURL,
    });
    setMessage('');
    onClearPhoto();
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setMessage(value);
  };

  const onAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = e;
    setMessage(value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setPhotoSource(result);
    };
    reader.readAsDataURL(imageFile);
  };

  const onClearPhoto = () => {
    if (!photoRef.current?.value) return;
    photoRef.current.value = '';
    setPhotoSource('');
  };

  return (
    <Form onSubmit={onSubmit} onKeyPress={(e) => onEnterPress(e, onSubmit)}>
      <TextWrapper>
        <ProfileImg
          src={userObj.photoURL !== null ? userObj.photoURL : GUEST_ICON}
        />
        <TextArea
          value={message}
          onChange={onAreaChange}
          maxLength={120}
          cols={1}
          rows={1}
          placeholder="What's on your mind?"
        />
      </TextWrapper>
      {photoSource && (
        <PhotoWrapper>
          <Photo src={photoSource} />
          <Button onClick={onClearPhoto}>
            <FontAwesomeIcon color="white" icon={faX} />
          </Button>
        </PhotoWrapper>
      )}
      <BottomNav>
        <Label htmlFor="photo_id">
          <FontAwesomeIcon size="2x" icon={faImage} />
          <PhotoInput
            ref={photoRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            id="photo_id"
          />
        </Label>
        <SubmitInput
          isMessage={message.length > 0 || photoSource !== ''}
          type="submit"
          value="Nweet"
        />
      </BottomNav>
    </Form>
  );
}
