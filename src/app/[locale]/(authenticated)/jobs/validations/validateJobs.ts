export const validateJobData = (jobData: any) => {
  if (!jobData.jobName || typeof jobData.jobName !== 'string') {
    throw new Error('Invalid job name')
  }
  if (!jobData.jobTitle || typeof jobData.jobTitle !== 'string') {
    throw new Error('Invalid job title')
  }
  if (!jobData.location || typeof jobData.location !== 'string') {
    throw new Error('Invalid job location')
  }
  if (!Array.isArray(jobData.requiredSkills) || jobData.requiredSkills.length === 0) {
    throw new Error('Invalid required skills')
  }
  if (!Array.isArray(jobData.requiredExperience) || jobData.requiredExperience.length === 0) {
    throw new Error('Invalid required experience')
  }
  if (!Array.isArray(jobData.credentials) || jobData.credentials.length === 0) {
    throw new Error('Invalid credentials')
  }
  if (!jobData.employerName || typeof jobData.employerName !== 'string') {
    throw new Error('Invalid employer name')
  }
  if (!jobData.compensation || typeof jobData.compensation !== 'string') {
    throw new Error('Invalid compensation')
  }
  if (!jobData.contactInfo || typeof jobData.contactInfo !== 'string') {
    throw new Error('Invalid contact information')
  }
  return true
}
