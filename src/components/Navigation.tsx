import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GUEST_NAME, HOME_URL, PROFILE_URL } from 'constants/constant';
import { authService } from '../firebase';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IUserObjProps } from 'utils/interface';

const Nav = styled.nav`
  position: fixed;
  bottom: 10%;
  left: 5%;
  @media only screen and (max-width: 1300px) {
    left: 0%;
  }
`;

const ListWrapper = styled.ul``;

const Icon = styled.div`
  margin-right: 10px;
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const List = styled.li<{ match: any }>`
  padding: 15px 30px;
  display: flex;
  align-items: center;
  font-size: 2em;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
  font-weight: bold;
  text-decoration: none;
  margin-bottom: 10px;
  border: 1px solid #111;
  box-shadow: 3px 3px #111;
  cursor: pointer;
  a {
    color: #111;
    text-decoration: none;
    @media only screen and (max-width: 1220px) {
      display: none;
    }
  }
  div {
    color: #111;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const Logout = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid #111;
  transition: all 0.2s ease-in-out;
  margin-top: 20px;
  margin-left: auto;
  display: block;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export default function Navigation({ userObj }: IUserObjProps) {
  const homeMatch = useMatch(HOME_URL);
  const profileMatch = useMatch(PROFILE_URL);
  const navigate = useNavigate();
  const userName = userObj.displayName ? userObj.displayName : GUEST_NAME;
  const onURLClick = (URL: string) => {
    navigate(URL);
  };
  const onLogoutClick = () => {
    authService.signOut();
    navigate(HOME_URL);
  };

  return (
    <Nav>
      <ListWrapper>
        <List onClick={() => onURLClick(HOME_URL)} match={homeMatch}>
          <Icon>
            <FontAwesomeIcon size="1x" icon={faHome} />
          </Icon>
          <Link to={HOME_URL}>Home</Link>
        </List>
        <List onClick={() => onURLClick(PROFILE_URL)} match={profileMatch}>
          <Icon>
            <FontAwesomeIcon size="1x" icon={faUser} />
          </Icon>
          <Link to={PROFILE_URL}>{userName}의 Profile</Link>
        </List>
        <Logout onClick={onLogoutClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M3 3.25c0-.966.784-1.75 1.75-1.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.25.25 0 0 0-.25.25v17.5c0 .138.112.25.25.25h5.5a.75.75 0 0 1 0 1.5h-5.5A1.75 1.75 0 0 1 3 20.75Zm16.006 9.5H10.75a.75.75 0 0 1 0-1.5h8.256l-3.3-3.484a.75.75 0 0 1 1.088-1.032l4.5 4.75a.75.75 0 0 1 0 1.032l-4.5 4.75a.75.75 0 0 1-1.088-1.032Z"></path>
          </svg>
        </Logout>
      </ListWrapper>
    </Nav>
  );
}
