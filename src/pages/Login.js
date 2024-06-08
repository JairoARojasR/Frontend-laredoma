import React from 'react'
import LoginFormp from '../components/LoginFormp'
import '../styles/Login.page.css'
import {config} from "../utils/axiosconfig";

const Login = () => {
  return (
    <div>
    <section>
     <LoginFormp/>
    </section>
    </div>
  )
}

export default Login
