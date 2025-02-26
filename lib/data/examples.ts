import { BeforeAfterExample } from "../types";
import { nanoid } from "nanoid";

export const sampleExamples: BeforeAfterExample[] = [
  {
    id: nanoid(),
    title: "Creative Writing Prompt Improvement",
    category: "clarity",
    tags: ["creative", "writing", "storytelling"],
    before: {
      prompt: "Write a story about a hero.",
      response: "Once upon a time, there was a brave hero who saved people. The hero was strong and kind. Everyone loved the hero. The hero fought many battles and won. The end.",
      issues: [
        {
          type: "vague",
          description: "No specific details about the hero or the story setting",
          span: [0, 24]
        },
        {
          type: "no-constraints",
          description: "No guidance on length, style, or tone",
          span: [0, 24]
        },
        {
          type: "generic-outcome",
          description: "Results in generic, predictable narrative",
          span: [0, 24]
        }
      ]
    },
    after: {
      prompt: "Write a 500-word short story about a reluctant hero who must confront their past. Set the story in a post-apocalyptic world where water is scarce. Use a first-person perspective and include at least one moral dilemma the hero faces. The tone should be bittersweet, with both moments of hope and despair.",
      response: "I still remember the day the last reservoir dried up. Ten years later, and the memory haunts me like a persistent ghost. They call me a hero now—the one who discovered the underground spring that saved our settlement—but they don't know what I had to sacrifice to find it.\n\nThe irony doesn't escape me. Before the collapse, I was just a hydrologist with a gambling problem and a failed marriage. Now, I'm the reluctant savior of three hundred souls...",
      improvements: [
        {
          type: "specific-parameters",
          description: "Added word count and perspective requirements",
          span: [0, 16]
        },
        {
          type: "character-details",
          description: "Specified the hero is reluctant and has a past to confront",
          span: [17, 67]
        },
        {
          type: "setting",
          description: "Defined a specific and interesting setting",
          span: [68, 119]
        },
        {
          type: "narrative-elements",
          description: "Required a moral dilemma for depth",
          span: [120, 196]
        },
        {
          type: "tone-guidance",
          description: "Specified the emotional tone",
          span: [197, 260]
        }
      ]
    },
    explanation: "The original prompt was too vague, leading to a generic and uninteresting story. The improved version provides specific parameters (word count, perspective), character details (reluctant hero with a past), a unique setting (post-apocalyptic world with water scarcity), required narrative elements (moral dilemma), and tone guidance. These specifics guide the AI to create a much more engaging and nuanced story with depth and originality."
  },
  {
    id: nanoid(),
    title: "Technical Assistance Prompt Refinement",
    category: "specificity",
    tags: ["technical", "coding", "debugging"],
    before: {
      prompt: "Fix my code.",
      response: "I'd be happy to help fix your code, but you haven't provided any code for me to review. Could you please share the code you're having trouble with, along with a description of what it's supposed to do and what issues you're experiencing?",
      issues: [
        {
          type: "missing-code",
          description: "No code provided to fix",
          span: [0, 13]
        },
        {
          type: "no-context",
          description: "No information about language, purpose, or errors",
          span: [0, 13]
        },
        {
          type: "vague-request",
          description: "Unclear what 'fix' means in this context",
          span: [0, 13]
        }
      ]
    },
    after: {
      prompt: "I'm trying to create a function in Python that calculates the Fibonacci sequence up to n terms, but it's not working correctly for inputs larger than 10. Here's my code:\n\n```python\ndef fibonacci(n):\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    elif n == 2:\n        return [0, 1]\n    else:\n        fib = [0, 1]\n        for i in range(2, n):\n            fib.append(fib[i-1] + fib[i-2])\n        return fib\n\nresult = fibonacci(20)\nprint(result)\n```\n\nThe function runs without errors but starts showing incorrect values after the 10th term. Can you identify what's wrong with my implementation and suggest a fix?",
      response: "Your Fibonacci implementation is actually correct! The function is calculating the sequence properly, and there are no errors in your logic.\n\nThe Fibonacci sequence grows very quickly, which might make you think the values are incorrect when they're actually correct. Let me show you the first 20 terms of the Fibonacci sequence:\n\n[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181]\n\nIf you were expecting different values, it might be due to a different definition of the Fibonacci sequence. Some definitions start with [1, 1] instead of [0, 1], but your implementation follows the standard definition where F(0)=0 and F(1)=1.\n\nIf you're concerned about performance for large values of n, you might consider using memoization or an iterative approach, but for correctness, your function is working as expected.",
      improvements: [
        {
          type: "specific-language",
          description: "Specified the programming language (Python)",
          span: [27, 33]
        },
        {
          type: "purpose",
          description: "Clearly stated what the code should do",
          span: [34, 83]
        },
        {
          type: "error-description",
          description: "Described the specific issue being encountered",
          span: [84, 130]
        },
        {
          type: "code-inclusion",
          description: "Included the actual code with proper formatting",
          span: [131, 408]
        },
        {
          type: "specific-question",
          description: "Asked a clear question about what needs to be fixed",
          span: [409, 508]
        }
      ]
    },
    explanation: "The original prompt 'Fix my code' provides no information for the AI to work with, resulting in a response asking for more details. The improved prompt includes all the essential elements: the programming language, the purpose of the code, a description of the issue, the complete code block with proper formatting, and a specific question about what needs to be fixed. This comprehensive context allows the AI to provide a helpful and accurate response, explaining that the code is actually correct and providing additional information about the Fibonacci sequence."
  },
  {
    id: nanoid(),
    title: "Business Analysis Prompt Enhancement",
    category: "context",
    tags: ["business", "analysis", "marketing"],
    before: {
      prompt: "Give me ideas for my business.",
      response: "Here are some general business ideas that might help:\n\n1. Enhance your online presence through social media marketing\n2. Implement a customer loyalty program\n3. Explore partnerships with complementary businesses\n4. Invest in employee training and development\n5. Consider expanding your product or service offerings\n6. Optimize your pricing strategy\n7. Improve customer service experience\n8. Analyze your competitors and identify gaps in the market\n9. Implement sustainable practices\n10. Explore new markets or demographics\n\nFor more specific recommendations, I would need more information about your business type, current challenges, goals, and resources.",
      issues: [
        {
          type: "no-business-context",
          description: "No information about the type of business",
          span: [0, 28]
        },
        {
          type: "no-goals",
          description: "No mention of business objectives or challenges",
          span: [0, 28]
        },
        {
          type: "no-constraints",
          description: "No information about resources or limitations",
          span: [0, 28]
        }
      ]
    },
    after: {
      prompt: "I run a small organic skincare business with 5 employees. We've been operating for 3 years and have a loyal local customer base, but our online sales have plateaued in the last 6 months. Our target demographic is environmentally-conscious women aged 25-45. We're looking to increase our digital presence and boost online sales by 30% in the next year, with a limited marketing budget of $1,500/month. What are 3-5 specific, cost-effective strategies we could implement to achieve this goal?",
      response: "Based on your organic skincare business profile and goals, here are 5 cost-effective strategies to boost your online sales by 30% within your $1,500/month budget:\n\n1. **Content-Driven SEO Strategy**: Create a blog featuring skincare routines, ingredient spotlights, and sustainability practices. Target keywords like \"organic skincare for sensitive skin\" or \"eco-friendly beauty routine\" to improve search rankings. Cost: $300-500/month for content creation and basic SEO tools.\n\n2. **Targeted Social Media Advertising**: Run highly targeted Facebook and Instagram ads to environmentally-conscious women 25-45. Create carousel ads showcasing before/after results and highlighting your sustainable practices. Cost: $400-600/month with precise audience targeting.\n\n3. **Email Marketing Automation**: Implement a segmented email strategy with personalized product recommendations based on previous purchases. Include educational content about ingredients and special offers for repeat customers. Cost: $100-200/month for an email platform with automation features.\n\n4. **Micro-Influencer Partnerships**: Collaborate with 3-5 micro-influencers (5,000-30,000 followers) who align with your eco-conscious values. Offer product-for-post arrangements or modest fees ($100-200 per influencer). Focus on authentic reviews rather than polished advertisements. Cost: $300-400/month.\n\n5. **Customer Referral Program**: Launch a digital referral program where existing customers receive a 15% discount when they refer friends (who also get 10% off their first purchase). Track with unique referral codes. Cost: $200-300/month for referral software and discounts.\n\nImplementation timeline: Start with email marketing and referral program in month 1, add SEO strategy in month 2, and begin influencer partnerships and paid social by month 3 for a comprehensive approach within your budget constraints.",
      improvements: [
        {
          type: "business-type",
          description: "Specified the type of business (organic skincare)",
          span: [6, 31]
        },
        {
          type: "business-size",
          description: "Included information about company size",
          span: [32, 45]
        },
        {
          type: "business-history",
          description: "Mentioned how long the business has been operating",
          span: [46, 76]
        },
        {
          type: "current-situation",
          description: "Described the current business situation",
          span: [77, 142]
        },
        {
          type: "target-demographic",
          description: "Specified the target customer base",
          span: [143, 207]
        },
        {
          type: "specific-goals",
          description: "Clearly stated business objectives with metrics",
          span: [208, 290]
        },
        {
          type: "constraints",
          description: "Mentioned budget limitations",
          span: [291, 334]
        },
        {
          type: "specific-request",
          description: "Asked for a specific number of actionable strategies",
          span: [335, 417]
        }
      ]
    },
    explanation: "The original prompt 'Give me ideas for my business' provides no context, resulting in generic advice that isn't particularly useful. The improved prompt includes comprehensive business context (type, size, history), the current situation (loyal local customers but plateaued online sales), target demographic (environmentally-conscious women 25-45), specific goals (increase online sales by 30% in a year), constraints (limited marketing budget), and a specific request (3-5 cost-effective strategies). This detailed context allows the AI to provide highly relevant, actionable strategies tailored to the business's specific situation and goals."
  }
];

export default sampleExamples; 