'use client'

import React, { useState } from 'react'

export function CommentsSection() {
  const [comments, setComments] = useState<string[]>([])
  const [newComment, setNewComment] = useState('')

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment])
      setNewComment('')
    }
  }

  return (
    <div className='mt-4'>
      <h3 className='text-lg font-semibold'>Comments</h3>
      <div className='space-y-2'>
        {comments.map((comment, index) => (
          <div key={index} className='p-2 bg-github-canvas-subtle rounded-md'>
            {comment}
          </div>
        ))}
      </div>
      <div className='flex mt-2'>
        <input
          type='text'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder='Add a comment...'
          className='flex-grow p-2 border border-github-border-default rounded-md'
        />
        <button
          onClick={handleCommentSubmit}
          className='ml-2 px-4 py-2 bg-github-success-emphasis text-white rounded-md'
        >
          Submit
        </button>
      </div>
    </div>
  )
}
