function Navbar() {

  return (

    <nav className="navbar">

      <h2 className="logo">
        ATM<span>Finder</span>
      </h2>


      <div className="nav-links">

        <a href="#home">
          Home
        </a>

        <a href="#explore">
          Explore
        </a>

        <a href="#" className="login-btn">
  Login
</a>

      </div>

    </nav>

  );

}

export default Navbar;