import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { actionCreators } from "../../store";

const Login = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const emailField = useRef();
    const passwordField = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const LogiUser = (e) => {
        e.preventDefault();
        let email = emailField.current.value;
        let password = passwordField.current.value;

        if (email === '' ) {
            alert('Enter email');
            return;
        }
        if (password === '') {
            alert('Enter Password');
            return;
        }
        
        setIsSubmitting(true);
        // Login
        axios.post(`${process.env.REACT_APP_API_ROOT}/login`,{
            email: email,
            password: password
        }).then((res)=>{
            if (!res.data.status){
                alert(res.data.message);
                localStorage.removeItem('token');
            } else {
                dispatch(actionCreators.LogIn(res.data));
                localStorage.setItem('token', res.data.token);
                alert('Login Success!');
                navigate('/profile');
            }
        }).catch((error) => {
            console.log('error', error);
        });
        setIsSubmitting(false);
    }

    return (
        <>
            <div className="w-full max-w-xs mx-auto">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={(e) => LogiUser(e)}>
                    <h2 className="text-xl font-semibold mb-10">Login</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email" ref={emailField} />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" ref={passwordField} />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={isSubmitting}>
                            Login
                        </button>
                        <Link to='/register' className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Register</Link>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Login;