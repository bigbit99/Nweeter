import React, { useEffect, useRef, useState } from 'react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { dbService, storageService } from '../../../firebase';
import { IMessageListProps } from 'utils/interface';
import { deleteObject, ref } from 'firebase/storage';
import { MESSAGES } from 'constants/constant';
import { dateFormater, onEnterPress } from 'utils/utilFn';
import TopBar from 'components/TopBar';

const Container = styled.div`
  position: relative;
  display: flex;
  width: 600px;
  border-left: 1px solid #111;
  border-right: 1px solid #111;
  border-top: none;
  padding: 17px;
`;

const UserInfoWrapper = styled.div`
  display: flex;
`;

const UserInfo = styled.div`
  font-size: 1.6em;
  font-weight: bold;
`;

const MessageText = styled.span`
  font-size: 1.6em;
  margin-bottom: 20px;
  white-space: pre-wrap;
`;

const ButtonWrapper = styled.div`
  position: relative;
  > svg {
    cursor: pointer;
  }
`;
const ButtonBox = styled.div`
  position: absolute;
  width: 200px;
  height: 80px;
  right: 0;
  top: 20px;
  border: 1px solid #111;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 3px 3px #111;
  > div:nth-child(1) {
    width: 100%;
    height: 25px;
    background-color: #74e7ca;
    border-bottom: 1px solid #111;
    display: flex;
    align-items: center;
    justify-content: end;

    > div:nth-child(1) {
      width: 15px;
      height: 15px;
      border: 1px solid #111;
      background-color: #fff;
      margin-right: 6px;
    }
  }
`;

const ButtonArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 15px;
`;

const Button = styled.button`
  width: 60px;
  height: 30px;
  font-size: 1.2em;
  border-radius: 8px;
  border: 1px solid #111;
  cursor: pointer;
  &:hover {
    background-color: #111;
    color: #fff;
  }
`;

const DeleteButton = styled(Button)`
  color: red;
  margin-right: 10px;
`;

const EditForm = styled.form`
  position: absolute;
  z-index: 444;
  width: 464px;
  border-radius: 10px;
  right: 0;
  top: 20px;
  margin: 0 auto;
  border: 1px solid #111;
  background-color: white;
  box-shadow: 3px 3px #111;
  overflow: hidden;
  > div:nth-child(1) {
    position: absolute;
    width: 100%;
    height: 25px;
    border-bottom: 1px solid #111;
    display: flex;
    align-items: center;
    justify-content: end;
    background-color: #74e7ca;
  }
  > div:nth-child(2) {
    width: 100%;
    padding: 40px 15px 15px 15px;
    box-sizing: border-box;
    overflow: hidden;
  }
`;

const EditInfo = styled.p`
  font-size: 1.6em;
  font-weight: bold;
  margin-right: 10px;
`;

const EditInput = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  max-height: 200px;
  margin-top: 10px;
  font-size: 1.6em;
  box-sizing: border-box;
  &::placeholder {
    font-size: 2em;
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

const EditSubmit = styled.input<{ isLength: boolean }>`
  width: 100px;
  height: 30px;
  font-size: 1.2em;
  display: block;
  margin-left: auto;
  margin-top: 10px;
  color: white;
  font-weight: bold;
  border: 1px solid #111;

  border-radius: 15px;
  cursor: ${({ isLength }) => (isLength ? 'pointer' : 'click')};
  background-color: ${({ theme, isLength }) =>
    isLength ? theme.mainBlueColor : theme.mainWhiteBlueColor};
`;

const EditClose = styled.div`
  cursor: pointer;
  border: 1px solid #111;
  background-color: #fff;
  margin-right: 10px;
  box-sizing: border-box;
  overflow: hidden;
  width: 17px;
  height: 17px;
  > svg {
    margin-right: 10px;
  }
`;

const Image = styled.img`
  width: 500px;
  height: 100%;
  border-radius: 20px;
  border: 1px solid #111;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: 1px solid #111;
`;

const UserWrapper = styled.div`
  display: flex;
  margin-top: 15px;
  margin-bottom: 10px;
  justify-content: space-between;
  width: 500px;
`;

const CreateDate = styled.span`
  font-size: 1.6em;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 100;
  margin-left: 10px;
`;

export default function Message({
  id,
  text,
  isOwner,
  photoURL,
  userId,
  createdAt,
  userImage,
  editOnly,
  setEditOnly,
}: IMessageListProps) {
  const [showButtonToggle, setShowButtonToggle] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editMessage, setEditMessage] = useState(text);
  const messageRef = doc(dbService, MESSAGES, `${id}`);

  const onDeleteClick = async () => {
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (ok) {
      await deleteDoc(messageRef);
      if (photoURL !== '') {
        await deleteObject(ref(storageService, photoURL));
      }
    }
  };

  const editRef = useRef<HTMLTextAreaElement>(null);

  const onToggleButton = () => {
    setShowButtonToggle((prev) => !prev);
  };
  const onToggleEdit = () => {
    setIsEdit((prev) => !prev);
    setTimeout(() => {
      if (editRef.current !== null) {
        editRef.current.focus();
      }
    }, 100);
  };

  const onEditSubmit = async (e: any) => {
    e.preventDefault();
    await updateDoc(messageRef, {
      text: editMessage,
    });
    setIsEdit(false);
    setShowButtonToggle(false);
  };

  const onEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditMessage(e.target.value);
  };

  return (
    <Container key={id}>
      <UserImage src={userImage} />
      <MessageWrapper>
        <UserWrapper>
          <UserInfoWrapper>
            <UserInfo>{userId}</UserInfo>
            {createdAt && <CreateDate>{dateFormater(createdAt)}</CreateDate>}
          </UserInfoWrapper>
          {isOwner && (
            <ButtonWrapper>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                onClick={onToggleButton}
              >
                <path d="M20 14a2 2 0 1 1-.001-3.999A2 2 0 0 1 20 14ZM6 12a2 2 0 1 1-3.999.001A2 2 0 0 1 6 12Zm8 0a2 2 0 1 1-3.999.001A2 2 0 0 1 14 12Z"></path>
              </svg>
              {showButtonToggle && (
                <ButtonBox>
                  <div>
                    <div onClick={onToggleButton}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                      >
                        <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
                      </svg>
                    </div>
                  </div>
                  <ButtonArea>
                    <DeleteButton onClick={onDeleteClick} value="Delete">
                      Delete
                    </DeleteButton>
                    <Button onClick={onToggleEdit} value="Edit">
                      Edit
                    </Button>
                  </ButtonArea>
                </ButtonBox>
              )}
              {isEdit && (
                <EditForm
                  onSubmit={onEditSubmit}
                  onKeyPress={(e) => onEnterPress(e, onEditSubmit)}
                >
                  <div>
                    <EditClose onClick={onToggleEdit}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="16"
                        width="16"
                        height="16"
                      >
                        <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
                      </svg>
                    </EditClose>
                  </div>
                  <div>
                    <EditInfo>수정 메세지</EditInfo>
                    <EditInput
                      ref={editRef}
                      onChange={onEditChange}
                      required
                      placeholder="수정할 내용을 입력해주세요"
                      value={editMessage}
                    />
                    <EditSubmit
                      isLength={editMessage.length > 0}
                      type="submit"
                      value="Complete"
                    />
                  </div>
                </EditForm>
              )}
            </ButtonWrapper>
          )}
        </UserWrapper>
        <MessageText>{text}</MessageText>
        {photoURL && <Image src={photoURL} />}
      </MessageWrapper>
    </Container>
  );
}
