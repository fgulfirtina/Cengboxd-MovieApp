import React, { useState } from 'react';
import './Form.css';
import emailjs from '@emailjs/browser';

const Help = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs
            .send(
                'service_07i1dbo',
                'template_y7y73mc',
                {
                    from_name: formData.name,
                    reply_to: formData.email,
                    message: formData.description,
                },
                'Za9gutnl-vCE0uvk7'
            )
            .then(
                (result) => {
                    console.log('Email successfully sent!', result.text);
                    alert('Message sent successfully!');
                    setFormData({
                        name: '',
                        email: '',
                        description: '',
                    });
                },
                (error) => {
                    console.error('Error sending email:', error.text);
                    alert('Failed to send message. Please try again.');
                }
            );
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Contact Us</h2>
            <p>Have questions? Fill out the form below, and we'll get back to you!</p>
            <form onSubmit={handleSubmit} className="contact-form">
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                />

                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                />

                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter your message"
                    required
                ></textarea>

            <button className="submit-button" type="submit">Send</button>
            </form>
        </div>
    );
};

export default Help;
