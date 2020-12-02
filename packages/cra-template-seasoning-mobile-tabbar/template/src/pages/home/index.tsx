import React from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.less';
import { ReactComponent as Logo } from 'images/logo.svg';

const Page = () => {
  return (
    <div className={`page ${style.page}`}>
      <div className={`fill column-center ${style.demo}`}>
        <h1>Home</h1>
        <Logo className={style.logo} />
        <Link to="/user">Go To User</Link>
      </div>
    </div>
  );
};

export default Page;
