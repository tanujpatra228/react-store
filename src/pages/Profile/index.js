import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const profileForm = useRef();
    const nameField = useRef();
    const emailField = useRef();
    const dobField = useRef();
    const genderMaleField = useRef();
    const genderFemaleField = useRef();
    const imageField = useRef();
    const profileImage = useRef();
    const navigate = useNavigate();
    const auth = useSelector(store => store.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(()=>{
        if (!Object.keys(auth).length) {
            navigate('/login');
        } else {
            getUserProfile();
        }
    }, [auth, navigate]);

    const setUserData = (user=null) => {
        if(user !== null){
            nameField.current.value = user.name;
            emailField.current.value = user.email;
            dobField.current.value = user.birth_date;

            // Gender
            if(user.gender === 'Male') {
                genderMaleField.current.checked = true;
            } else {
                genderFemaleField.current.checked = true;
            }

            // Profile image
            let imgSrc = (user.image.includes('/')) ? `${user.image}` : `${process.env.REACT_APP_IMG_ROOT}${user.image}`;
            profileImage.current.src = (user.image) ? `${imgSrc}` : 'https://via.placeholder.com/150';
        }
    }

    const getUserProfile = () => {
        axios.get(`${process.env.REACT_APP_API_ROOT}/getUserProfile`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
        })
        .then((res) => {
            // Set user data if available
            if (res.data.status){
                let {user} = res.data;
                setUserData(user);
            }
        }).catch((error) => {
            console.log('error', error.message);
        });
    }

    const updateUser = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', nameField.current.value);
        formData.append('email', emailField.current.value);
        // formData.append('birth_date', dobField.current.value); // DOB update not supported in API
        // formData.append('gender', genderMaleField.current.checked ? 'Male' : 'Female'); // Gender update not supported in API
        imageField.current?.files[0] && formData.append('image', imageField.current.files[0]);
        formData.append('_method', 'PUT');

        axios.post(`${process.env.REACT_APP_API_ROOT}/profileUpdate/${auth.user.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
          }).then(res => {
            if (res.data.status) {
                alert(res.data.message);
                getUserProfile();
            } else {
                alert(res.data.message);
            }
            setIsSubmitting(false);
        }).catch(error => {
            console.log('error', error.message);
            setIsSubmitting(false);
        });
    }

    return (
        <>
            {
                Object.keys(auth).length && (
                    <>
                        <div className="register">
                            <div className="w-full max-w-xs mx-auto">
                                <form encType="multipart/form-data" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={updateUser} ref={profileForm}>
                                    <h2 className="text-xl font-semibold mb-10 text-center">Profile</h2>
                                    <div>
                                        <div className='w-24 h-24 mx-auto bg-gray-400 rounded-full cursor-pointer relative'>
                                            <img
                                                src={`${auth?.user.image}`}
                                                alt={auth?.user.name}
                                                className="rounded-full"
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                                onClick={() => imageField.current.click()}
                                                ref={profileImage}
                                            />
                                            <EditIcon className='absolute top-[70px] left-[70px] z-10' />
                                        </div>
                                        <input type='file' id='image' accept="image/png, image/jpeg" name='image' style={{ display: 'none' }} ref={imageField} />
                                    </div>
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
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 disabled:text-gray-500 leading-tight focus:outline-none focus:shadow-outline" id="DOB" type="date" placeholder="DOB" disabled ref={dobField} />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Gender
                                        </label>
                                        <div className="flex items-center gap-5">
                                            <div>
                                                <input type='radio' id='male' name='gender' disabled value='male' ref={genderMaleField} />
                                                <label htmlFor="male" className="ml-2 text-gray-500">Male</label>
                                            </div>
                                            <div>
                                                <input type='radio' id='female' name='gender' disabled value='female' ref={genderFemaleField} />
                                                <label htmlFor="female" className="ml-2 text-gray-500">Female</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={isSubmitting}>
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    );
}

export default Profile;