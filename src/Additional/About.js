import React from 'react';
import './About.css'; // Make sure this file is updated with the new styles

const About = () => {
  return (
    <div className="about-container">
      <section className="about-section">
        <h2 className="section-title">About Us</h2>
        <p className="section-text">
          Welcome to Denton Shop, your go-to destination for all your clothing needs! We are a team of passionate individuals striving to provide you with the best online shopping experience.
        </p>
      </section>

      <section className="team-section">
        <h3 className="section-title">Meet Our Team</h3>
        <div className="team-grid">
          {/* Consider using a map function if you have a list of team members */}
          <div className="team-member">
            <h5>Vishal Kandunuri</h5>
            <p className="member-email">vishalkandunuri@my.unt.edu</p>
          </div>
              <div className="col-md-6">
                <div className="team-member">
                  <h5>Supriya Reddy Attapuram</h5>
                  <p className="member-email">supriyareddyattapuram@my.unt.edu</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="team-member">
                  <h5>Sumuk Reddy Kalagiri</h5>
                  <p className="member-email">SumukReddyKalagiri@my.unt.edu</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="team-member">
                  <h5>Manojkumar Bandari</h5>
                  <p className="member-email">Manojkumarbandari@my.unt.edu</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="team-member">
                  <h5>Parvesh Saivarmabhupatiraju</h5>
                  <p className="member-email">parveshsaivarmabhupatiraju@my.unt.edu</p>
                </div>
              </div>
          </div>
      </section>

      <section className="project-section">
        <h3 className="section-title">Our Project</h3>
        <p className="section-text">
          Our project aims to provide a secure and user-friendly platform for purchasing clothing items online. Users can browse through our collection of products, add items to their cart, and securely place orders.
        </p>
      </section>

      <section className="features-section">
        <h3 className="section-title">Key Features</h3>
        <ul className="features-list">
          <li>Product Catalog</li>
          <li>Secure Cart</li>
          <li>Order Management</li>
          <li>User Authentication</li>
        </ul>
      </section>

      <section className="mission-section">
        <h3 className="section-title">Our Mission</h3>
        <p className="section-text">
          We are committed to delivering a seamless shopping experience while prioritizing security and user privacy. Our goal is to build trust with our customers and provide them with a reliable platform for all their clothing needs.
        </p>
        <p className="section-text">
          Thank you for choosing Denton Shop. Happy shopping!
        </p>
      </section>
    </div>
  );
}

export default About;