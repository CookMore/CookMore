import React, { useState } from 'react'

const EnterpriseContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Example: Sending form data to an email service
    try {
      // Replace with your email sending logic
      // e.g., using EmailJS, a backend API, etc.
      console.log('Sending email to cookmore@proton.me:', formData)

      // Simulate successful submission
      setTimeout(() => {
        setIsSubmitting(false)
        setSuccessMessage('Your message has been sent successfully!')
        setFormData({ name: '', email: '', message: '' })
      }, 2000)
    } catch (error) {
      console.error('Error sending email:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-github-fg-default mb-1' htmlFor='name'>
          Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          className='w-full p-2 border border-github-border-default rounded-md bg-github-canvas-subtle text-github-fg-default'
          required
        />
      </div>
      <div>
        <label className='block text-github-fg-default mb-1' htmlFor='email'>
          Email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          className='w-full p-2 border border-github-border-default rounded-md bg-github-canvas-subtle text-github-fg-default'
          required
        />
      </div>
      <div>
        <label className='block text-github-fg-default mb-1' htmlFor='message'>
          Message
        </label>
        <textarea
          id='message'
          name='message'
          value={formData.message}
          onChange={handleChange}
          className='w-full p-2 border border-github-border-default rounded-md bg-github-canvas-subtle text-github-fg-default'
          required
          rows={4}
        />
      </div>
      <button type='submit' className='btn btn-primary w-full' disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
      {successMessage && <p className='text-success-fg mt-4'>{successMessage}</p>}
    </form>
  )
}

export default EnterpriseContactForm
