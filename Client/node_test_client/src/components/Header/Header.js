import React from 'react'
import {NavLink} from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <nav className="navbar navbar-dark bg-dark d-flex justify-content-between align-items-center ">
                <NavLink className="navbar-brand" to="/">Home</NavLink>
                <div className="d-flex justify-content-between align-items-center " id="navbarSupportedContent">
                    <ul className="navbar-nav d-flex flex-row justify-content-between  align-items-center ">
                        <li className="nav-item d-flex justify-content-between align-items-center pr-3">
                            <NavLink className="nav-link" to="/category">Category Page</NavLink>
                        </li>
                        <li className="nav-item d-flex justify-content-between align-items-center ">
                            <NavLink className="nav-link" to="/products">Product Page</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default Header;
