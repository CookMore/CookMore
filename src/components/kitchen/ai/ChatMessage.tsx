interface ChatMessageProps {
  message: AIMessage
  tier: ProfileTier
}

export function ChatMessage({ message, tier }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg p-4 mb-4',
        message.role === 'assistant'
          ? 'bg-github-accent-subtle ml-4'
          : 'bg-github-canvas-subtle mr-4'
      )}
    >
      {/* Message Header */}
      <div className='flex items-center mb-2'>
        {message.role === 'assistant' ? (
          <ChefHatIcon className='w-5 h-5 mr-2 text-github-accent-fg' />
        ) : (
          <UserIcon className='w-5 h-5 mr-2 text-github-fg-muted' />
        )}
        <span className='text-sm text-github-fg-muted'>
          {message.role === 'assistant' ? 'CookMore AI' : 'You'}
        </span>
      </div>

      {/* Message Content with Markdown */}
      <div className='prose dark:prose-invert max-w-none'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeBlock,
            table: Table,
            // Custom components for recipes, ingredients, etc.
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>

      {/* Tier-specific badges/features */}
      {message.metadata?.functionCall && (
        <div className='mt-2'>
          <TierFeatureBadge tier={tier} feature={message.metadata.functionCall} />
        </div>
      )}
    </motion.div>
  )
}

// New component for better message styling
interface MessageContentProps {
  content: string
  role: 'user' | 'assistant'
}

function MessageContent({ content, role }: MessageContentProps) {
  // Split content into sections based on line breaks and dashes
  const sections = content.split('\n\n').filter(Boolean)

  return (
    <div className='space-y-4'>
      {sections.map((section, idx) => {
        // Check if section is a list
        if (section.includes('\n- ')) {
          const [title, ...items] = section.split('\n')
          return (
            <div key={idx} className='space-y-2'>
              {title && <div className='font-medium'>{title}</div>}
              <ul className='space-y-1'>
                {items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className={cn(
                      'flex items-start gap-2',
                      role === 'assistant' ? 'text-github-fg-default' : 'text-github-fg-muted'
                    )}
                  >
                    <span className='text-github-accent-fg'>•</span>
                    <span>{item.replace('- ', '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        }

        // Check if section contains measurements or temperatures
        const hasNumbers = /\d/.test(section)
        return (
          <div
            key={idx}
            className={cn(
              'leading-relaxed',
              hasNumbers && role === 'assistant'
                ? 'font-mono text-github-accent-fg'
                : 'text-github-fg-default'
            )}
          >
            {section}
          </div>
        )
      })}
    </div>
  )
}
