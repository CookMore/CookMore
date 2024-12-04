import { cn } from '@/lib/utils'

interface MessageContentProps {
  content: string
  role: 'user' | 'assistant'
}

export function MessageContent({ content, role }: MessageContentProps) {
  // Split content into sections based on blank lines
  const sections = content.split('\n\n').filter(Boolean)

  return (
    <div className='space-y-4'>
      {sections.map((section, idx) => {
        // Handle headers (lines followed by blank lines)
        if (idx === 0 && !section.includes('\n')) {
          return (
            <h3 key={idx} className='text-lg font-semibold text-github-fg-default'>
              {section}
            </h3>
          )
        }

        // Handle lists
        if (section.includes('\n• ') || section.includes('\n- ')) {
          const [title, ...items] = section.split('\n')
          return (
            <div key={idx} className='space-y-2'>
              {title && <div className='font-medium text-github-fg-default'>{title}</div>}
              <ul className='space-y-1.5 pl-1'>
                {items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className={cn(
                      'flex items-start gap-2',
                      role === 'assistant' ? 'text-github-fg-default' : 'text-github-fg-muted'
                    )}
                  >
                    <span className='text-github-accent-fg mt-1.5'>•</span>
                    <span className='flex-1'>{item.replace(/^[•-]\s+/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        }

        // Handle sections with measurements or temperatures
        const lines = section.split('\n')
        return (
          <div key={idx} className='space-y-2'>
            {lines.map((line, lineIdx) => {
              // Check for bold text (between ** or __)
              const boldPattern = /(\*\*|__)(.*?)\1/g
              const lineWithBold = line.replace(
                boldPattern,
                '<strong class="font-semibold">$2</strong>'
              )

              // Check for measurements and temperatures
              const hasMeasurements = /\d+\s*(?:cup|tbsp|tsp|oz|lb|g|kg|°[FC])/i.test(line)

              return (
                <div
                  key={lineIdx}
                  className={cn(
                    'leading-relaxed',
                    hasMeasurements && role === 'assistant'
                      ? 'font-mono text-github-accent-fg'
                      : 'text-github-fg-default'
                  )}
                  dangerouslySetInnerHTML={{ __html: lineWithBold }}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
