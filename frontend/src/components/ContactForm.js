// ContactForm.js
import React, { useState } from "react";
import "../styles/contact.css";
import { FaUser, FaEnvelope, FaRegCommentDots, FaRegFileAlt } from "react-icons/fa";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
      setTimeout(() => setSuccess(false), 4000);
    } else {
      setSuccess(false);
    }
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="input-group">
          <span className="input-icon"><FaUser /></span>
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className={errors.name ? "input-error" : ""} />
        </div>
        {errors.name && <span className="error">{errors.name}</span>}
        <div className="input-group">
          <span className="input-icon"><FaEnvelope /></span>
          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className={errors.email ? "input-error" : ""} />
        </div>
        {errors.email && <span className="error">{errors.email}</span>}
        <div className="input-group">
          <span className="input-icon"><FaRegFileAlt /></span>
          <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className={errors.subject ? "input-error" : ""} />
        </div>
        {errors.subject && <span className="error">{errors.subject}</span>}
        <div className="input-group">
          <span className="input-icon"><FaRegCommentDots /></span>
          <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} className={errors.message ? "input-error" : ""}></textarea>
        </div>
        {errors.message && <span className="error">{errors.message}</span>}
        <button type="submit" className="contact-btn">Send Message</button>
        {success && <div className="success-message">Your message has been sent! Thank you for contacting us.</div>}
      </form>
    </div>
  );
};

export default ContactForm;
