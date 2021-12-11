/** @format */

import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import signinImage from '../assets/signup.jpg';

const cookies = new Cookies();

interface formState {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  avatarURL: string;
}
const initialState = {
  fullName: '',
  username: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  avatarURL: '',
};

const Auth = () => {
  const [form, setForm] = useState<formState>(initialState);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password, phoneNumber, avatarURL } = form;

    const URL = 'https://rp-portfolio-3.herokuapp.com/api/v1';

    setIsFetching(true);
    const {
      data: { token, userId, hashedPassword, fullName },
    } =
      //dynamic fetching to login or signup depending upon the scenario
      await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
        username,
        password,
        fullName: form.fullName,
        phoneNumber,
        avatarURL,
      });

    cookies.set('token', token);
    cookies.set('username', username);
    cookies.set('fullName', fullName);
    cookies.set('userId', userId);

    if (isSignup) {
      cookies.set('phoneNumber', phoneNumber);
      cookies.set('avatarURL', avatarURL);
      cookies.set('hashedPassword', hashedPassword);
    }
    setForm(initialState);
    setIsFetching(false);
    //reload the browser to access the updated cookies
    window.location.reload();
  };

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  };

  return (
    <div className='auth__form-container'>
      <div className='auth__form-container_fields'>
        <div className='auth__form-container_fields-content'>
          <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
          {!isSignup && (
            <div>
              <p>Demo username: Dr. Anita</p>
              <p>Demo password: test0123</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className='auth__form-container_fields-content_input'>
                <label htmlFor='fullName'>Full Name</label>
                <input
                  name='fullName'
                  type='text'
                  placeholder='Full Name'
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className='auth__form-container_fields-content_input'>
              <label htmlFor='username'>Username</label>
              <input
                name='username'
                type='text'
                placeholder='Username'
                onChange={handleChange}
                required
              />
            </div>
            {isSignup && (
              <div className='auth__form-container_fields-content_input'>
                <label htmlFor='phoneNumber'>Phone Number</label>
                <input
                  name='phoneNumber'
                  type='text'
                  placeholder='Phone Number'
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            {isSignup && (
              <div className='auth__form-container_fields-content_input'>
                <label htmlFor='avatarURL'>Avatar URL</label>
                <input
                  name='avatarURL'
                  type='text'
                  placeholder='Avatar URL'
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className='auth__form-container_fields-content_input'>
              <label htmlFor='password'>Password</label>
              <input
                name='password'
                type='password'
                placeholder='Password'
                onChange={handleChange}
                required
              />
            </div>
            {isSignup && (
              <div className='auth__form-container_fields-content_input'>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input
                  name='confirmPassword'
                  type='password'
                  placeholder='Confirm Password'
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className='auth__form-container_fields-content_button'>
              <button disabled={isFetching}>
                {isSignup ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </form>
          <div className='auth__form-container_fields-account'>
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <span onClick={switchMode}>
                {isSignup ? 'Sign In' : 'Sign Up'}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className='auth__form-container_image'>
        <img src={signinImage} alt='sign in' />
      </div>
    </div>
  );
};

export default Auth;
