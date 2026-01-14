import React from 'react'
import {Link} from 'react-router-dom';
import "./ErrorPage.css";

const Page404 = () => {
  return (
    <div className='error-page-wrapper'>
        <h1>Greška 404 - stranica nije pronađena</h1>
        <h2>Nazad na <Link to="/">prijavu</Link></h2>
    </div>
  )
}

export default Page404