export const validateJobData = (jobData: any) => {
  // Basic validation logic
  if (!jobData.title || typeof jobData.title !== 'string') {
    throw new Error('Invalid job title')
  }
  if (!jobData.description || typeof jobData.description !== 'string') {
    throw new Error('Invalid job description')
  }
  // Add more validation as needed
  return true
}
