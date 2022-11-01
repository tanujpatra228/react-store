import axios from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const regiForm = useRef();
    const nameField = useRef();
    const emailField = useRef();
    const passwordField = useRef();
    const dobField = useRef();
    const genderMaleField = useRef();
    const passwordConfField = useRef();
    const imageField = useRef();
    const navigate = useNavigate();

    const basicValidation = (value) => {
        console.log('value', value);
        let isValid = false;
        if (value.name === ''){
            alert('Name is reuired!');
        } else if (value.email === ''){
            alert('Email is reuired!');
        } else if (value.dob === ''){
            alert('MRP must be greater then 0!');
        } else if (value.password <= 0){
            alert('Please enter password!');
        } else if (value.passwordConf === null){
            alert('Please enter same password!');
        } else if (value.password === value.passwordConf){
            alert('Passwords must match!');
        } else {
            isValid = true;
        }
        return isValid;
    }

    const registerUser = (e) => {
        e.preventDefault();

        if (!basicValidation({
            name: nameField.current.value,
            email: emailField.current.value,
            dob: dobField.current.value,
            password: passwordField.current.value,
            passwordConf: passwordConfField.current.value,
        })) {return;}

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', nameField.current.value);
        formData.append('email', emailField.current.value);
        formData.append('birth_date', dobField.current.value);
        formData.append('gender', genderMaleField.current.checked ? 'Male' : 'Female');
        formData.append('password', passwordField.current.value);
        formData.append('password_confirmation', passwordConfField.current.value);
        formData.append('image', imageField.current?.files[0] || null);

        axios.post(`${process.env.REACT_APP_API_ROOT}/register`, formData).then(res => {
            if (res.data.status) {
                alert(res.data.message);
                regiForm.current.reset();
                navigate('/login');
            } else {
                alert(res.data.message);
            }
            setIsSubmitting(false);
        }).catch(error => {
            console.log('error', error.message);
            setIsSubmitting(false);
        });
    }
    return(
        <>
            <div className="register">
                <div className="w-full max-w-xs mx-auto">
                    <form encType="multipart/form-data" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={(e) => registerUser(e)} ref={regiForm}>
                        <h2 className="text-xl font-semibold mb-10">Register</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name" ref={nameField} />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email" ref={emailField} />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="DOB">
                                DOB
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="DOB" type="date" placeholder="DOB" ref={dobField} />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Gender
                            </label>
                            <div className="flex items-center gap-5">
                                <div>
                                    <input type='radio' id='male' name='gender' defaultChecked value='male' ref={genderMaleField} />
                                    <label htmlFor="male" className="ml-2">Male</label>
                                </div>
                                <div>
                                    <input type='radio' id='female' name='gender' value='female' />
                                    <label htmlFor="female" className="ml-2">Female</label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" ref={passwordField} />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password-conf">
                                Password Confirmation
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password-conf" type="password" placeholder="******************" ref={passwordConfField} />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Image
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="image" type="file" ref={imageField} />
                        </div>

                        <div className="flex items-center justify-between">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={isSubmitting}>
                                Register
                            </button>
                            <Link to='/login' className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;