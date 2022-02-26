import { createContext, useReducer } from 'react';
import { createRenderer } from 'react-dom/test-utils';
import githubReducer from './GithubReducer';

const GithubContext = createContext();

const GIHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GIHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  // Create initial state and destructure current state and dispatch
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };
  const [state, dispatch] = useReducer(githubReducer, initialState);

  // Set Loading
  const setLoading = () => dispatch({ type: 'SET_LOADING' });

  // Get Search Results
  const searchUsers = async (text) => {
    setLoading();
    const params = new URLSearchParams({
      q: text,
    });
    const response = await fetch(`${GIHUB_URL}/search/users?${params}`, {
      headers: {
        Authorization: `token ${GIHUB_TOKEN}`,
      },
    });
    const { items } = await response.json();
    dispatch({
      type: 'GET_USERS',
      payload: items,
    });
  };

  // Clear users from state
  const clearUsers = () => dispatch({ type: 'CLEAR_USERS' });

  // Get single user
  const getUser = async (login) => {
    setLoading();
    const response = await fetch(`${GIHUB_URL}/users/${login}`, {
      headers: {
        Authorization: `token ${GIHUB_TOKEN}`,
      },
    });

    if (response.status === 404) {
      window.location = '/notfound';
    } else {
      const data = await response.json();
      dispatch({
        type: 'GET_USER',
        payload: data,
      });
    }
  };

  // Get user repos
  const getUserRepos = async (login) => {
    setLoading();
    const params = new URLSearchParams({
      sort: 'created',
      per_page: 10,
    });
    const response = await fetch(
      `${GIHUB_URL}/users/${login}/repos?${params}`,
      {
        headers: {
          Authorization: `token ${GIHUB_TOKEN}`,
        },
      }
    );
    const data = await response.json();
    dispatch({
      type: 'GET_REPOS',
      payload: data,
    });
  };

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        loading: state.loading,
        repos: state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
