import React, { useState } from 'react';
import { Building2, Home, Factory, Download, Calendar, Target, Lightbulb, FileText, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [formData, setFormData] = useState({
    projectType: 'residential',
    projectName: '',
    developer: '',
    city: '',
    country: '',
    landmark: '',
    targetAudience: [],
    usps: '',
    marketingGoals: [],
    contentNeeds: [],
    apiKey: ''
  });
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const projectTypes = [
    { id: 'residential', label: 'Residential', icon: Home },
    { id: 'commercial', label: 'Commercial', icon: Building2 },
    { id: 'industrial', label: 'Industrial', icon: Factory }
  ];

  const audienceOptions = ['HNIs', 'UHNIs', 'NRIs', 'Corporates', 'Retail Investors', 'Institutional Investors'];
  const goalOptions = ['Brand Awareness', 'Lead Generation', 'Investor Trust', 'Pre-Launch Buzz'];
  const contentOptions = ['Social Posts', 'Ad Copies', 'Video Scripts', 'Investor Articles', 'Landing Page Copy'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const callGroqAPI = async (prompt, systemPrompt) => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${formData.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error('API call failed. Please check your API key.');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      throw new Error(err.message || 'Failed to generate content');
    }
  };

  const generateWithAI = async () => {
    if (!formData.apiKey) {
      setError('Please enter your Groq API key to use AI generation');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Generate all content types in parallel
      const [socialPosts, adCopies, creativePrompts, campaignCalendar, targetingSuggestions, leadMagnetCopy] = await Promise.all([
        generateAISocialPosts(),
        generateAIAdCopies(),
        generateAICreativePrompts(),
        generateAICampaignCalendar(),
        generateAITargeting(),
        generateAILeadMagnet()
      ]);

      setGeneratedContent({
        socialPosts,
        adCopies,
        creativePrompts,
        campaignCalendar,
        targetingSuggestions,
        leadMagnetCopy
      });

      setActiveTab('results');
    } catch (err) {
      setError(err.message || 'Failed to generate content. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAISocialPosts = async () => {
    const systemPrompt = `You are an expert real estate marketing specialist with deep knowledge of Indian and global real estate markets. Create highly engaging, persuasive social media posts that convert viewers into leads.`;

    const prompt = `Create 10 unique, creative social media posts for this real estate project:

Project Details:
- Type: ${formData.projectType}
- Name: ${formData.projectName}
- Developer: ${formData.developer || 'Premium Developer'}
- Location: ${formData.city}, ${formData.country || 'India'}
- Landmark: ${formData.landmark || 'Prime location'}
- Target Audience: ${formData.targetAudience.join(', ')}
- USPs: ${formData.usps || 'Premium amenities, strategic location'}
- Marketing Goals: ${formData.marketingGoals.join(', ')}

Requirements:
1. Research ${formData.city} real estate market and mention actual connectivity, nearby areas
2. Create varied posts for Facebook, Instagram, LinkedIn, Twitter
3. Use emojis strategically
4. Include strong CTAs
5. Mix of emotional appeal, ROI focus, urgency, lifestyle
6. Each post must be unique and creative
7. Include relevant hashtags
8. Make it compelling for ${formData.targetAudience.join(', ')}

Format each post as:
Platform: [platform name]
Copy: [post content with emojis and formatting]
CTA: [specific call to action]
---`;

    const result = await callGroqAPI(prompt, systemPrompt);
    return parseAIPosts(result);
  };

  const generateAIAdCopies = async () => {
    const systemPrompt = `You are a performance marketing expert specializing in real estate. Create high-converting ad copies that drive clicks and leads.`;

    const prompt = `Create 5 different ad copies for various platforms for this project:

Project: ${formData.projectName}
Type: ${formData.projectType}
Location: ${formData.city}, ${formData.country || 'India'}
Target: ${formData.targetAudience.join(', ')}
USPs: ${formData.usps}

Platforms needed: Facebook Lead Ads, Google Search Ads, LinkedIn Sponsored Content, Instagram Story Ads, YouTube Pre-Roll

For each ad provide:
- Platform-specific headline (attention-grabbing)
- Ad body (benefit-focused, creates urgency)
- Strong CTA

Format:
Platform: [name]
Headline: [headline]
Body: [ad copy]
CTA: [call to action]
---`;

    const result = await callGroqAPI(prompt, systemPrompt);
    return parseAIAds(result);
  };

  const generateAICreativePrompts = async () => {
    const systemPrompt = `You are an expert in AI image generation prompts for real estate marketing. Create detailed, photorealistic prompts.`;

    const prompt = `Create 5 detailed AI image generation prompts for ${formData.projectType} project "${formData.projectName}" in ${formData.city}.

Each prompt should:
1. Be highly detailed and photorealistic
2. Include lighting, composition, atmosphere
3. Mention specific architectural styles relevant to ${formData.city}
4. Include human elements and lifestyle aspects
5. Be optimized for Midjourney/DALL-E/Stable Diffusion

Prompt types needed:
1. Hero/Banner Image
2. Interior/Amenity Showcase
3. Aerial/Location View
4. Lifestyle/People Image
5. Night/Evening Shot

Format:
Purpose: [purpose]
Prompt: [detailed prompt]
Suggested Use: [where to use this image]
---`;

    const result = await callGroqAPI(prompt, systemPrompt);
    return parseAIPrompts(result);
  };

  const generateAICampaignCalendar = async () => {
    const systemPrompt = `You are a social media strategist creating comprehensive campaign calendars for real estate projects.`;

    const prompt = `Create a 30-day (4-week) social media campaign calendar for:

Project: ${formData.projectName}
Type: ${formData.projectType}
Goals: ${formData.marketingGoals.join(', ')}
Audience: ${formData.targetAudience.join(', ')}

For each week provide:
- Weekly theme (strategic and creative)
- Content focus (what to emphasize)
- 4 post ideas with days and formats
- Platform mix (Instagram, Facebook, LinkedIn, YouTube)

Format:
Week [number]: [Theme Name]
Content Focus: [description]
Posts:
- Monday: [format] on [platform]
- Wednesday: [format] on [platform]
- Friday: [format] on [platform]
- Sunday: [format] on [platform]
---`;

    const result = await callGroqAPI(prompt, systemPrompt);
    return parseAICalendar(result);
  };

  const generateAITargeting = async () => {
    const systemPrompt = `You are a digital advertising expert specializing in audience targeting for real estate.`;

    const prompt = `Create detailed targeting strategies for each audience segment:

Target Audiences: ${formData.targetAudience.join(', ')}
Project Type: ${formData.projectType}
Location: ${formData.city}

For each audience provide:
- Demographics (age, income, occupation)
- Interests & Behaviors
- Best platforms
- Ad formats that work
- Geographic targeting (specific areas/countries)
- Messaging angle

Format:
Audience: [name]
Demographics: [details]
Interests: [list]
Platforms: [list]
Ad Formats: [list]
Geos: [specific locations]
---`;

    const result = await callGroqAPI(prompt, systemPrompt);
    return parseAITargeting(result);
  };

  const generateAILeadMagnet = async () => {
    const systemPrompt = `You are a conversion copywriter expert in real estate lead generation.`;

    const prompt = `Create 4 compelling lead magnet landing page copies:

1. ROI Calculator
2. Brochure Download
3. Virtual Tour Signup
4. Enquiry Form

Project: ${formData.projectName}
Type: ${formData.projectType}
Target: ${formData.targetAudience.join(', ')}
USPs: ${formData.usps}

For each lead magnet:
- Compelling headline
- Benefit-rich subheading
- Persuasive body copy (2-3 paragraphs)
- Strong CTA button text
- Form fields needed

Format:
Type: [lead magnet type]
Headline: [headline]
Subheading: [subheading]
Body: [body copy]
CTA: [button text]
Fields: [field1, field2, field3]
---`;

    const result = await callGroqAPI(prompt, systemPrompt);
    return parseAILeadMagnet(result);
  };

  // Parsing functions
  const parseAIPosts = (text) => {
    const posts = [];
    const sections = text.split('---').filter(s => s.trim());
    
    sections.forEach((section, index) => {
      const platformMatch = section.match(/Platform:\s*(.+)/i);
      const copyMatch = section.match(/Copy:\s*([\s\S]+?)(?=CTA:|$)/i);
      const ctaMatch = section.match(/CTA:\s*(.+)/i);
      
      if (copyMatch) {
        posts.push({
          id: index + 1,
          platform: platformMatch ? platformMatch[1].trim() : 'Social Media',
          copy: copyMatch[1].trim(),
          cta: ctaMatch ? ctaMatch[1].trim() : 'Learn More'
        });
      }
    });
    
    return posts.length > 0 ? posts : generateFallbackPosts();
  };

  const parseAIAds = (text) => {
    const ads = [];
    const sections = text.split('---').filter(s => s.trim());
    
    sections.forEach(section => {
      const platformMatch = section.match(/Platform:\s*(.+)/i);
      const headlineMatch = section.match(/Headline:\s*(.+)/i);
      const bodyMatch = section.match(/Body:\s*([\s\S]+?)(?=CTA:|$)/i);
      const ctaMatch = section.match(/CTA:\s*(.+)/i);
      
      if (headlineMatch && bodyMatch) {
        ads.push({
          platform: platformMatch ? platformMatch[1].trim() : 'Digital Platform',
          headline: headlineMatch[1].trim(),
          body: bodyMatch[1].trim(),
          cta: ctaMatch ? ctaMatch[1].trim() : 'Learn More'
        });
      }
    });
    
    return ads.length > 0 ? ads : generateFallbackAds();
  };

  const parseAIPrompts = (text) => {
    const prompts = [];
    const sections = text.split('---').filter(s => s.trim());
    
    sections.forEach((section, index) => {
      const purposeMatch = section.match(/Purpose:\s*(.+)/i);
      const promptMatch = section.match(/Prompt:\s*([\s\S]+?)(?=Suggested Use:|$)/i);
      const useMatch = section.match(/Suggested Use:\s*(.+)/i);
      
      if (promptMatch) {
        prompts.push({
          id: index + 1,
          purpose: purposeMatch ? purposeMatch[1].trim() : `Visual ${index + 1}`,
          prompt: promptMatch[1].trim(),
          suggestedUse: useMatch ? useMatch[1].trim() : 'Marketing materials'
        });
      }
    });
    
    return prompts.length > 0 ? prompts : generateFallbackPrompts();
  };

  const parseAICalendar = (text) => {
    const calendar = [];
    const weeks = text.split(/Week\s+\d+:/i).filter(s => s.trim());
    
    weeks.forEach((week, index) => {
      const themeMatch = week.match(/^([^\n]+)/);
      const contentMatch = week.match(/Content Focus:\s*(.+)/i);
      const postsSection = week.match(/Posts:([\s\S]+?)(?=Week|$)/i);
      
      const posts = [];
      if (postsSection) {
        const postLines = postsSection[1].split('\n').filter(l => l.trim() && l.includes(':'));
        postLines.forEach(line => {
          const dayMatch = line.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\s*(.+?)\s+on\s+(.+)/i);
          if (dayMatch) {
            posts.push({
              day: dayMatch[1],
              format: dayMatch[2].trim(),
              platform: dayMatch[3].trim()
            });
          }
        });
      }
      
      if (themeMatch) {
        calendar.push({
          week: index + 1,
          theme: themeMatch[1].trim(),
          content: contentMatch ? contentMatch[1].trim() : 'Strategic content planning',
          posts: posts.length > 0 ? posts : generateFallbackWeekPosts()
        });
      }
    });
    
    return calendar.length > 0 ? calendar : generateFallbackCalendar();
  };

  const parseAITargeting = (text) => {
    const targeting = [];
    const sections = text.split(/Audience:|---/).filter(s => s.trim() && !s.startsWith('Audience:'));
    
    sections.forEach(section => {
      const audienceMatch = section.match(/^([^\n]+)/);
      const demoMatch = section.match(/Demographics:\s*(.+)/i);
      const interestsMatch = section.match(/Interests:\s*(.+)/i);
      const platformsMatch = section.match(/Platforms:\s*(.+)/i);
      const formatsMatch = section.match(/(?:Ad\s+)?Formats:\s*(.+)/i);
      const geosMatch = section.match(/Geos?:\s*(.+)/i);
      
      if (audienceMatch) {
        targeting.push({
          audience: audienceMatch[1].trim(),
          demographics: demoMatch ? demoMatch[1].trim() : 'Varied demographics',
          interests: interestsMatch ? interestsMatch[1].trim() : 'Real estate, investments',
          platforms: platformsMatch ? platformsMatch[1].trim() : 'Facebook, Instagram, LinkedIn',
          adFormats: formatsMatch ? formatsMatch[1].trim() : 'All formats',
          geos: geosMatch ? geosMatch[1].trim() : formData.city || 'Target locations'
        });
      }
    });
    
    return targeting.length > 0 ? targeting : generateFallbackTargeting();
  };

  const parseAILeadMagnet = (text) => {
    const leadMagnets = {};
    const types = ['ROI Calculator', 'Brochure', 'Virtual Tour', 'Enquiry'];
    const sections = text.split(/Type:|---/).filter(s => s.trim());
    
    sections.forEach((section, index) => {
      const headlineMatch = section.match(/Headline:\s*(.+)/i);
      const subheadingMatch = section.match(/Subheading:\s*(.+)/i);
      const bodyMatch = section.match(/Body:\s*([\s\S]+?)(?=CTA:|Fields:|$)/i);
      const ctaMatch = section.match(/CTA:\s*(.+)/i);
      const fieldsMatch = section.match(/Fields:\s*(.+)/i);
      
      if (headlineMatch && index < types.length) {
        const key = types[index].toLowerCase().replace(/\s+/g, '');
        leadMagnets[key] = {
          headline: headlineMatch[1].trim(),
          subheading: subheadingMatch ? subheadingMatch[1].trim() : 'Get exclusive access',
          body: bodyMatch ? bodyMatch[1].trim() : 'Discover the potential of this premium project.',
          cta: ctaMatch ? ctaMatch[1].trim() : 'Get Started',
          formFields: fieldsMatch ? fieldsMatch[1].split(',').map(f => f.trim()) : ['Name', 'Email', 'Phone']
        };
      }
    });
    
    return Object.keys(leadMagnets).length > 0 ? leadMagnets : generateFallbackLeadMagnet();
  };

  // Fallback functions
  const generateFallbackPosts = () => {
    return [{
      id: 1,
      platform: 'Social Media',
      copy: `🏢 ${formData.projectName || 'Premium Project'} - Your gateway to ${formData.projectType} excellence in ${formData.city}!\n\n✨ ${formData.usps || 'World-class amenities and strategic location'}\n\n📞 Enquire now!`,
      cta: 'Learn More'
    }];
  };

  const generateFallbackAds = () => {
    return [{
      platform: 'Digital Ads',
      headline: `${formData.projectName} - ${formData.city}`,
      body: `Premium ${formData.projectType} project. ${formData.usps || 'Excellent location and amenities'}`,
      cta: 'Enquire Now'
    }];
  };

  const generateFallbackPrompts = () => {
    return [{
      id: 1,
      purpose: 'Hero Image',
      prompt: `Photorealistic ${formData.projectType} project, modern architecture, ${formData.city} skyline, golden hour, professional photography`,
      suggestedUse: 'Website banner, social media'
    }];
  };

  const generateFallbackCalendar = () => {
    return [{
      week: 1,
      theme: 'Project Launch',
      content: 'Introduce the project and key features',
      posts: generateFallbackWeekPosts()
    }];
  };

  const generateFallbackWeekPosts = () => {
    return [
      { day: 'Monday', format: 'Image Post', platform: 'Instagram/Facebook' },
      { day: 'Wednesday', format: 'Video', platform: 'Instagram' },
      { day: 'Friday', format: 'Article', platform: 'LinkedIn' },
      { day: 'Sunday', format: 'Carousel', platform: 'All Platforms' }
    ];
  };

  const generateFallbackTargeting = () => {
    return formData.targetAudience.map(aud => ({
      audience: aud,
      demographics: 'Age 25-60, Middle to high income',
      interests: 'Real estate, investments, property',
      platforms: 'Facebook, Instagram, LinkedIn',
      adFormats: 'All formats',
      geos: formData.city || 'Target location'
    }));
  };

  const generateFallbackLeadMagnet = () => {
    return {
      roicalculator: {
        headline: `Calculate Your ${formData.projectName} Returns`,
        subheading: 'See your investment potential',
        body: 'Enter your details to calculate projected returns.',
        cta: 'Calculate Now',
        formFields: ['Name', 'Email', 'Phone', 'Investment Amount']
      },
      brochure: {
        headline: `Download ${formData.projectName} Brochure`,
        subheading: 'Complete project details',
        body: 'Get the official brochure with all specifications.',
        cta: 'Download Brochure',
        formFields: ['Name', 'Email', 'Phone']
      },
      virtualtour: {
        headline: `Virtual Tour of ${formData.projectName}`,
        subheading: 'Experience from anywhere',
        body: 'Book your exclusive virtual walkthrough.',
        cta: 'Book Tour',
        formFields: ['Name', 'Email', 'Phone', 'Preferred Date']
      },
      enquiry: {
        headline: `Enquire About ${formData.projectName}`,
        subheading: 'Get exclusive offers',
        body: 'Connect with our team for special pre-launch deals.',
        cta: 'Enquire Now',
        formFields: ['Name', 'Email', 'Phone', 'Message']
      }
    };
  };

  const downloadContent = (format) => {
    let content = '';
    
    if (format === 'txt') {
      content = `Real Estate Marketing Content - ${formData.projectName || 'Project'}\n`;
      content += `Generated with AI on ${new Date().toLocaleDateString()}\n\n`;
      content += `=== SOCIAL MEDIA POSTS ===\n\n`;
      generatedContent.socialPosts.forEach(post => {
        content += `POST #${post.id} (${post.platform})\n${post.copy}\nCTA: ${post.cta}\n\n---\n\n`;
      });
      
      content += `\n=== AD COPIES ===\n\n`;
      generatedContent.adCopies.forEach(ad => {
        content += `${ad.platform}\nHeadline: ${ad.headline}\nBody: ${ad.body}\nCTA: ${ad.cta}\n\n---\n\n`;
      });
      
      content += `\n=== CREATIVE PROMPTS ===\n\n`;
      generatedContent.creativePrompts.forEach(prompt => {
        content += `${prompt.purpose}\nPrompt: ${prompt.prompt}\nUse: ${prompt.suggestedUse}\n\n---\n\n`;
      });
      
      content += `\n=== CAMPAIGN CALENDAR ===\n\n`;
      generatedContent.campaignCalendar.forEach(week => {
        content += `Week ${week.week}: ${week.theme}\n${week.content}\n`;
        week.posts.forEach(post => {
          content += `${post.day}: ${post.format} (${post.platform})\n`;
        });
        content += `\n---\n\n`;
      });
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.projectName || 'project'}-ai-marketing-content.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  Real Estate Marketing Automation
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </h1>
                <p className="text-xs text-slate-400">AI-Powered Creative Content Generation</p>
              </div>
            </div>
            {generatedContent && (
              <button
                onClick={() => downloadContent('txt')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-slate-800/30 border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-6 py-3 text-sm font-medium transition ${
                activeTab === 'input'
                  ? 'bg-slate-700 text-white border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Project Input
            </button>
            <button
              onClick={() => activeTab === 'results' && setActiveTab('results')}
              disabled={!generatedContent}
              className={`px-6 py-3 text-sm font-medium transition ${
                activeTab === 'results'
                  ? 'bg-slate-700 text-white border-b-2 border-blue-400'
                  : generatedContent
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              Generated Content
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'input' && (
          <div className="max-w-4xl mx-auto">
            {/* API Key Section */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl border border-blue-700/50 p-6 mb-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">AI-Powered Generation</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    Enter your Groq API key to unlock creative, unique, and researched content generation.
                    Your API key is stored only in your browser and never sent to our servers.
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="password"
                      value={formData.apiKey}
                      onChange={(e) => handleInputChange('apiKey', e.target.value)}
                      placeholder="Enter your Groq API key (gsk_...)"
                      className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    />
                    <a
                      href="https://console.groq.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition whitespace-nowrap"
                    >
                      Get API Key
                    </a>
                  </div>
                  {!formData.apiKey && (
                    <p className="text-xs text-yellow-400 mt-2">
                      ⚠️ Without an API key, the tool will use basic templates
                    </p>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-400" />
                Project Details
              </h2>

              {/* Project Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Project Type *</label>
                <div className="grid grid-cols-3 gap-4">
                  {projectTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleInputChange('projectType', type.id)}
                        className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                          formData.projectType === type.id
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <Icon className="w-8 h-8" />
                        <span className="font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name *</label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    placeholder="e.g., Sai Industrial Park"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Developer Name</label>
                  <input
                    type="text"
                    value={formData.developer}
                    onChange={(e) => handleInputChange('developer', e.target.value)}
                    placeholder="e.g., ABC Developers"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="e.g., Ghaziabad"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="e.g., India"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Landmark</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                    placeholder="e.g., Near Metro Station"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Target Audience *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {audienceOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => toggleArrayField('targetAudience', option)}
                      className={`px-4 py-2 rounded-lg border transition text-sm ${
                        formData.targetAudience.includes(option)
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* USPs */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Key USPs & Features</label>
                <textarea
                  value={formData.usps}
                  onChange={(e) => handleInputChange('usps', e.target.value)}
                  placeholder="e.g., RERA Approved, 24/7 Security, Premium Amenities, Strategic Location, High ROI Potential"
                  rows="3"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Marketing Goals */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Marketing Goals</label>
                <div className="grid grid-cols-2 gap-3">
                  {goalOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => toggleArrayField('marketingGoals', option)}
                      className={`px-4 py-2 rounded-lg border transition text-sm ${
                        formData.marketingGoals.includes(option)
                          ? 'border-green-500 bg-green-500/20 text-white'
                          : 'border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Needs */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3">Content Needs</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {contentOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => toggleArrayField('contentNeeds', option)}
                      className={`px-4 py-2 rounded-lg border transition text-sm ${
                        formData.contentNeeds.includes(option)
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateWithAI}
                disabled={!formData.projectName || !formData.city || formData.targetAudience.length === 0 || isGenerating}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating Creative Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate AI-Powered Content
                  </>
                )}
              </button>
              
              {isGenerating && (
                <p className="text-center text-sm text-slate-400 mt-3">
                  AI is researching {formData.city} market and creating unique content... This may take 30-60 seconds.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'results' && generatedContent && (
          <div className="space-y-6">
            {/* Social Media Posts */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-400" />
                Social Media Posts ({generatedContent.socialPosts.length})
              </h3>
              <div className="grid gap-4">
                {generatedContent.socialPosts.map(post => (
                  <div key={post.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-blue-400 uppercase">{post.platform}</span>
                      <span className="text-xs text-slate-400">Post #{post.id}</span>
                    </div>
                    <p className="text-sm whitespace-pre-line mb-3">{post.copy}</p>
                    <div className="text-xs text-green-400 font-medium">CTA: {post.cta}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Copies */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Ad Copies ({generatedContent.adCopies.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {generatedContent.adCopies.map((ad, index) => (
                  <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <div className="text-xs font-semibold text-green-400 uppercase mb-2">{ad.platform}</div>
                    <h4 className="font-bold mb-2">{ad.headline}</h4>
                    <p className="text-sm text-slate-300 mb-3">{ad.body}</p>
                    <div className="text-xs text-blue-400 font-medium">CTA: {ad.cta}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creative Prompts */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                AI Creative Prompts ({generatedContent.creativePrompts.length})
              </h3>
              <div className="grid gap-4">
                {generatedContent.creativePrompts.map(prompt => (
                  <div key={prompt.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-semibold text-yellow-400">{prompt.purpose}</span>
                      <span className="text-xs text-slate-400">Prompt #{prompt.id}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2 italic">"{prompt.prompt}"</p>
                    <div className="text-xs text-blue-400">Suggested Use: {prompt.suggestedUse}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Calendar */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-400" />
                30-Day Campaign Calendar
              </h3>
              <div className="grid gap-4">
                {generatedContent.campaignCalendar.map(week => (
                  <div key={week.week} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <h4 className="font-bold text-purple-400 mb-2">Week {week.week}: {week.theme}</h4>
                    <p className="text-sm text-slate-300 mb-3">{week.content}</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {week.posts.map((post, idx) => (
                        <div key={idx} className="text-xs bg-slate-800/50 rounded p-2">
                          <span className="font-semibold text-blue-400">{post.day}:</span> {post.format} ({post.platform})
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Targeting Suggestions */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-red-400" />
                Audience Targeting Suggestions
              </h3>
              <div className="grid gap-4">
                {generatedContent.targetingSuggestions.map((suggestion, index) => (
                  <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <h4 className="font-bold text-red-400 mb-3">{suggestion.audience}</h4>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400">Demographics:</span>
                        <p className="text-slate-200">{suggestion.demographics}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Interests:</span>
                        <p className="text-slate-200">{suggestion.interests}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Platforms:</span>
                        <p className="text-slate-200">{suggestion.platforms}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Ad Formats:</span>
                        <p className="text-slate-200">{suggestion.adFormats}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-slate-400">Geographic Focus:</span>
                        <p className="text-slate-200">{suggestion.geos}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Magnet Copy */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-cyan-400" />
                Lead Magnet Landing Page Copy
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(generatedContent.leadMagnetCopy).map(([key, magnet]) => (
                  <div key={key} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <h4 className="font-bold text-cyan-400 mb-2">{magnet.headline}</h4>
                    <p className="text-sm text-slate-400 mb-2">{magnet.subheading}</p>
                    <p className="text-sm text-slate-300 mb-3 whitespace-pre-line">{magnet.body}</p>
                    <div className="flex gap-2 mb-3">
                      <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs font-semibold transition">
                        {magnet.cta}
                      </button>
                      {magnet.whatsappCta && (
                        <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-xs font-semibold transition">
                          {magnet.whatsappCta}
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      Form Fields: {magnet.formFields.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 border-t border-slate-700 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>Real Estate Marketing Automation Tool • AI-Powered Creative Content Generation</p>
          <p className="mt-1 text-xs">Built for HNI, UHNI, NRI & Corporate Investors</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
