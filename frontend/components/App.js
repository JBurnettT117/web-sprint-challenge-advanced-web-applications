import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';
import axios from 'axios';
import PrivateRoute from "./PrivateRoute";

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ navigate("/")}
  const redirectToArticles = () => { /* ✨ implement */ navigate("/articles")}

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if(localStorage.getItem("token")){
      localStorage.removeItem("token");
      setMessage("Goodbye!");
    }
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    const creds = { "username": username, "password": password }
    axios.post('http://localhost:9000/api/login', creds)
      .then(res => {
        setMessage(res.data.message);
        localStorage.setItem("token", res.data.token);
        redirectToArticles();
        setSpinnerOn(false);
      })
      .catch(err => {
        console.log("error: ", err);
      })
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    const token = localStorage.getItem("token");
    axios.get("http://localhost:9000/api/articles", {
      headers: {
        authorization: token
      }
    })
      .then(res => {
        setMessage(res.data.message);
        setArticles(res.data.articles);
      })
      .catch(err => {
        console.log(err);
        redirectToLogin();
      })
    setSpinnerOn(false);
  }

  const postArticle = (values) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    const token = localStorage.getItem("token");
    const payload = { "title": values.title, "text": values.text, "topic": values.topic };
    axios.post("http://localhost:9000/api/articles", payload, {
      headers: {
        authorization: token
      }
    })
      .then(res => {
        console.log(res);
        setMessage(res.data.message);
        setArticles([...articles, res.data.article]);
      })
      .catch(err => {
        console.log("error: ", err)
      })
  }

  const updateArticle = ({ article_id, values }) => {
    // ✨ implement
    // You got this!
    const token = localStorage.getItem("token");
    const payload = values;
    const newArticles = [...articles];
    axios.put(`http://localhost:9000/api/articles/${article_id}`, payload, {
      headers: {
        authorization: token
      }
    })
    .then(res => {
      console.log(res);
      setMessage(res.data.message);
      newArticles[article_id - 1] = res.data.article;
      setArticles(newArticles);
    })
    .catch(err => {
      console.log(err);
    })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    
    const token = localStorage.getItem("token");
    axios.delete(`http://localhost:9000/api/articles/${article_id}`, {
      headers: {
        authorization: token
      }
    })
      .then(res => {
        console.log(res);
        setMessage(res.data.message);
        const newArticles = articles.filter(article => {
          return article.article_id !== article_id;
        });
        setArticles(newArticles);
      })
      .catch(err => {
        console.log(err);
      })
    
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route element={<PrivateRoute setMessage={setMessage} />}>
            <Route path="articles" element={
              <>
                <ArticleForm postArticle={postArticle} updateArticle={updateArticle} setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId} articles={articles}/>
                <Articles getArticles={getArticles} articles={articles} setCurrentArticleId={setCurrentArticleId} deleteArticle={deleteArticle}/>
              </>
            } />
          </Route>
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
