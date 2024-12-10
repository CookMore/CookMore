interface ProfileDisplayProps {
  profile: Profile | null
  onEdit?: () => void // Make onEdit optional
}

export function ProfileDisplay({ profile, onEdit }: ProfileDisplayProps) {
  // ... rest of component
  // Only show edit button if onEdit is provided
  return (
    <div>
      {/* ... profile display ... */}
      {onEdit && <button onClick={onEdit}>Edit Profile</button>}
    </div>
  )
}
