import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import styled from 'styled-components';
import { dbService } from '../../firebase';
import { IMessageListProps, IUserObjProps } from 'utils/interface';
import { CREATED_AT, MESSAGES } from 'constants/constant';
import MessageForm from './components/MessageForm';
import Message from './components/Message';
import { Helmet } from 'react-helmet';
import Navigation from 'components/Navigation';
import TopBar from 'components/TopBar';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  overflow: scroll;
  background-image: linear-gradient(to top, #fbc7d4, #c59de6, #9897f0);
  padding: 40px;
  box-sizing: border-box;
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

const ScrollWrap = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
`;

const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MessageWrapper = styled.div``;

export default function Home({ userObj }: IUserObjProps) {
  const [messageList, setMessageList] = useState<any>([]);
  const [editOnly, setEditOnly] = useState(false);
  const [fetch, setFetch] = useState(false);

  useEffect(() => {
    const q = query(
      collection(dbService, MESSAGES),
      orderBy(CREATED_AT, 'desc')
    );
    onSnapshot(q, (snapshot) => {
      const messageArr = snapshot.docs.map((item: any) => {
        return {
          id: item.id,
          ...item.data(),
        };
      });
      setMessageList(messageArr);
    });
  }, []);

  useEffect(() => {
    setInterval(() => {
      setFetch((prev) => !prev);
    }, 60000);
  }, []);

  return (
    <Container>
      <ContainerBox>
        <TopBar></TopBar>
        <ScrollWrap>
          <ContentWrap>
            <Navigation userObj={userObj} />
            <MessageForm userObj={userObj} />
            <MessageWrapper>
              {messageList.map((item: IMessageListProps) => (
                <Message
                  editOnly={editOnly}
                  setEditOnly={setEditOnly}
                  key={item.id}
                  id={item.id}
                  userId={item.userId}
                  userImage={item.userImage}
                  text={item.text}
                  photoURL={item.photoURL}
                  createdAt={item.createdAt}
                  isOwner={userObj.uid === item.creatorId}
                />
              ))}
            </MessageWrapper>
          </ContentWrap>
        </ScrollWrap>
      </ContainerBox>
    </Container>
  );
}
