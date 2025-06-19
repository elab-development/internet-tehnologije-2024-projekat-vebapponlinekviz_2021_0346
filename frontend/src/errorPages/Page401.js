import React from 'react'
import { Link } from 'react-router-dom';
import "./ErrorPage.css";

const Page401 = () => {
  return (
    <div className='error-page-wrapper'>
        <h1>Greška 401 - Neautorizovan pristup stranici</h1>
        <h2>Nazad na <Link to="/">prijavu</Link></h2>
    </div>
  )
}

export default Page401