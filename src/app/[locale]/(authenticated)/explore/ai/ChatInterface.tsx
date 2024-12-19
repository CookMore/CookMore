const TIER_WELCOME_MESSAGES = {
  [ProfileTier.FREE]: `Hi! I'm your CookMore AI assistant. With your Free tier, I can help you with:
• Basic recipe suggestions
• Simple cooking tips
• Common ingredient substitutions
• Basic kitchen advice

Want more advanced features? Upgrade to Pro or Group tier! What would you like to know about?`,

  [ProfileTier.PRO]: `Hi! I'm your CookMore AI assistant. With your Pro tier, I can help you with:
• Advanced recipe modifications
• Professional cooking techniques
• Detailed ingredient substitutions
• Equipment recommendations
• Scaling recipes for different servings
• Chef's tips and tricks

What would you like to explore today?`,

  [ProfileTier.GROUP]: `Hi! I'm your CookMore AI assistant. With your Group tier, you have access to all features:
• Team recipe planning
• Bulk cooking instructions
• Cost analysis and budgeting
• Professional kitchen management
• Equipment optimization
• Advanced collaboration features
• All Pro tier features included

How can I assist your team today?`,

  [ProfileTier.OG]: `Welcome to CookMore's exclusive OG tier! I'm your dedicated AI assistant, and you have access to our most premium features:
• Early access to new recipes and features
• Exclusive cooking masterclasses
• Priority support and personalized guidance
• Custom recipe development
• Advanced meal planning and optimization
• Exclusive community events and networking
• VIP kitchen consultations
• All Pro and Group features included

As an OG member, you're part of our elite culinary community. How can I enhance your cooking journey today?`,
} as const
