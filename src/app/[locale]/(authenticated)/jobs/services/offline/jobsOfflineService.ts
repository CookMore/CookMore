// src/app/[locale]/(authenticated)/jobs/services/offline/jobsOfflineService.ts

/**
 * Simulates offline-based CRUD. In real usage, you might store data in IndexedDB or
 * local JSON files. For now, this is a stub that logs to console.
 */

export const fetchOfflineJobs = () => {
  // Simulate fetching jobs from offline storage
  return [
    {
      id: 1,
      title: 'Offline Software Engineer',
      description: 'Develop offline software applications.',
    },
    {
      id: 2,
      title: 'Offline Product Manager',
      description: 'Manage offline product development.',
    },
  ]
}

export const saveJobOffline = (jobData: any) => {
  // Simulate saving a job to offline storage
  console.log('Job saved offline:', jobData)
  return { id: Date.now(), ...jobData }
}
