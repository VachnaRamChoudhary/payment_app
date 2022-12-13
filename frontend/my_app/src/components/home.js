import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Link from "@mui/material/Link";



const Home = () => {
    const navigate = useNavigate();

    const [user, setUser] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    const Navigate = React.useCallback(() => {

        return navigate('/signin');

    }, [navigate]);



    useEffect(() => {

       try {
        const token=localStorage.getItem('token');
        if(typeof token === 'string') {
            console.log(typeof token);
            const exp_time = jwtDecode(token).exp;
            const now= new Date().getTime()/1000;
            if (exp_time < now) {

                Navigate();
                return;
            }
        } else {
            Navigate();
            return;
        }
       } catch(err) {
        Navigate()
        return
       }

        fetch('http://localhost:4000/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },

        })
            .then((res) => {
                if (res.status >= 400) {
                    Navigate();
                }
                return res.json()
            })
            .then((data) => {
                setUser(prevState => {
                    return {
                        ...prevState,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        email: data.user.email,
                    }
                })

            })
            .catch((err) => {
                console.log(err);
            });





    }, [Navigate]);



    return (
        <div>
            <h3>
                {`Welcome ${user.firstName} ${user.lastName}`}
            </h3>
            
            <div>
                <div><Link href="/signin">Signin</Link></div>
                <div><Link href="/signup">Signup</Link></div>
                <div><Link href="/payment">Make Payment</Link></div>
                <div><Link href="/update">Update Profile</Link></div>
                <div><Link onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/signin');
                }}>Sign out</Link></div>
                
            </div>

        </div>
    );
}

export default Home;