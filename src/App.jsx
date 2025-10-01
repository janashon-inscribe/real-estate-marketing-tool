import React, { useState } from 'react';
import { Building2, Home, Factory, Download, Calendar, Target, Lightbulb, FileText, TrendingUp, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

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
  const [apiKeyValid, setApiKeyValid] = useState(null);

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
    if (field === 'apiKey') {
      setApiKeyValid(null);
    }
  };

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const testApiKey = async () => {
    if (!formData.apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsGenerating(true);
    setError('');
    setApiKeyValid(null);

    try {
      const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${formData.apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: 'Hello',
          parameters: {
            max_new_tokens: 10,
            temperature: 0.7
          }
        }),
      });

      if (response.ok) {
        setApiKeyValid(true);
        setError('');
      } else {
        const errorData = await response.json();
        setApiKeyValid(false);
        if (response.status === 401) {
          setError('Invalid API key. Please check your key at huggingface.co/settings/tokens');
        } else if (response.status === 429) {
          setError('Rate limit exceeded. Please wait a moment and try again.');
        } else {
          setError(`API Error: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (err) {
      setApiKeyValid(false);
      setError(`Connection error: ${err.message}. Please check your internet connection.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const callHuggingFaceAPI = async (prompt, systemPrompt) => {
    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}\n\nAssistant:`;
    
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${formData.apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 2000,
            temperature: 0.8,
            top_p: 0.9,
            return_full_text: false
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error (${response.status})`);
      }

      const data = await response.json();
      return data[0]?.generated_text || '';
    } catch (err) {
      throw err;
    }
  };

  const generateWithAI = async () => {
    if (!formData.apiKey.trim()) {
      setError('Please enter your Hugging Face API key first and test it using the "Test API Key" button');
      return;
    }

    if (apiKeyValid === false) {
      setError('Please test your API key first using the "Test API Key" button');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const socialPosts = await generateAISocialPosts();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const adCopies = await generateAIAdCopies();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const creativePrompts = await generateAICreativePrompts();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const campaignCalendar = await generateAICampaignCalendar();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const targetingSuggestions = await generateAITargeting();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const leadMagnetCopy = await generateAILeadMagnet();

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
      console.error('Generation error:', err);
      setError(`Failed to generate content: ${err.message}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAISocialPosts = async () => {
    const systemPrompt = `You are an expert real estate marketing specialist. Create highly engaging, persuasive social media posts that convert viewers into leads. Use emojis strategically and include strong CTAs.`;

    const prompt = `Create 10 unique social media posts for:

Project: ${formData.projectName}
Type: ${formData.projectType}
Location: ${formData.city}, ${formData.country || 'India'}
Landmark: ${formData.landmark || 'Prime location'}
Target: ${formData.targetAudience.join(', ')}
USPs: ${formData.usps || 'Premium amenities'}
Goals: ${formData.marketingGoals.join(', ')}

Create posts for: Facebook, Instagram, LinkedIn, Twitter
Each post must be unique, creative, and include relevant hashtags.

Format each as:
Platform: [name]
Copy: [full post with emojis]
CTA: [call to action]
---`;

    const result = await callHuggingFaceAPI(prompt, systemPrompt);
    return parseAIPosts(result);
  };

  const generateAIAdCopies = async () => {
    const systemPrompt = `You are a performance marketing expert. Create high-converting ad copies for real estate.`;

    const prompt = `Create 5 ad copies for:

Project: ${formData.projectName}
Location: ${formData.city}
Type: ${formData.projectType}
Target: ${formData.targetAudience.join(', ')}
USPs: ${formData.usps}

Platforms: Facebook Lead Ads, Google Search, LinkedIn, Instagram Stories, YouTube

Format:
Platform: [name]
Headline: [compelling headline]
Body: [benefit-focused copy]
CTA: [action]
---`;

    const result = await callHuggingFaceAPI(prompt, systemPrompt);
    return parseAIAds(result);
  };

  const generateAICreativePrompts = async () => {
    const systemPrompt = `You are an AI image generation expert. Create detailed, photorealistic prompts for real estate marketing.`;

    const prompt = `Create 5 AI image prompts for ${formData.projectType} project in ${formData.city}:

1. Hero/Banner image
2. Interior showcase
3. Aerial view
4. Lifestyle scene
5. Night shot

Each prompt should be detailed, photorealistic, and optimized for Midjourney/DALL-E.

Format:
Purpose: [purpose]
Prompt: [detailed prompt]
Suggested Use: [usage]
---`;

    const result = await callHuggingFaceAPI(prompt, systemPrompt);
    return parseAIPrompts(result);
  };

  const generateAICampaignCalendar = async () => {
    const systemPrompt = `You are a social media strategist. Create comprehensive campaign calendars.`;

    const prompt = `Create a 4-week campaign calendar for:

Project: ${formData.projectName}
Type: ${formData.projectType}
Goals: ${formData.marketingGoals.join(', ')}
Audience: ${formData.targetAudience.join(', ')}

For each week: theme, content focus, 4 post ideas with days and platforms.

Format:
Week [number]: [Theme]
Content Focus: [description]
Posts:
- Monday: [format] on [platform]
- Wednesday: [format] on [platform]
- Friday: [format] on [platform]
- Sunday: [format] on [platform]
---`;

    const result = await callHuggingFaceAPI(prompt, systemPrompt);
    return parseAICalendar(result);
  };

  const generateAITargeting = async () => {
    const systemPrompt = `You are a digital advertising expert. Create detailed audience targeting strategies.`;

    const prompt = `Create targeting for: ${formData.targetAudience.join(', ')}

Project: ${formData.projectType} in ${formData.city}

For each audience: demographics, interests, platforms, ad formats, geos, messaging angle.

Format:
Audience: [name]
Demographics: [details]
Interests: [list]
Platforms: [list]
Ad Formats: [list]
Geos: [specific locations]
---`;

    const result = await callHuggingFaceAPI(prompt, systemPrompt);
    return parseAITargeting(result);
  };

  const generateAILeadMagnet = async () => {
    const systemPrompt = `You are a conversion copywriter expert in real estate lead generation.`;

    const prompt = `Create 4 lead magnet copies:
1. ROI Calculator
2. Brochure Download
3. Virtual Tour
4. Enquiry Form

Project: ${formData.projectName}
Type: ${formData.projectType}
Target: ${formData.targetAudience.join(', ')}

Format:
Type: [type]
Headline: [headline]
Subheading: [subheading]
Body: [2-3 paragraphs]
CTA: [button text]
Fields: [field1, field2, field3]
---`;

    const result = await callHuggingFaceAPI(prompt, systemPrompt);
    return parseAILeadMagnet(result);
  };

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
          content: contentMatch ? contentMatch[1].trim() : 'Strategic content',
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
    const types = ['calculator', 'brochure', 'virtualtour', 'enquiry'];
    const sections = text.split(/Type:|---/).filter(s => s.trim());
    
    sections.forEach((section, index) => {
      const headlineMatch = section.match(/Headline:\s*(.+)/i);
      const subheadingMatch = section.match(/Subheading:\s*(.+)/i);
      const bodyMatch = section.match(/Body:\s*([\s\S]+?)(?=CTA:|Fields:|$)/i);
      const ctaMatch = section.match(/CTA:\s*(.+)/i);
      const fieldsMatch = section.match(/Fields:\s*(.+)/i);
      
      if (headlineMatch && index < types.length) {
        leadMagnets[types[index]] = {
          headline: headlineMatch[1].trim(),
          subheading: subheadingMatch ? subheadingMatch[1].trim() : 'Get exclusive access',
          body: bodyMatch ? bodyMatch[1].trim() : 'Discover premium opportunities.',
          cta: ctaMatch ? ctaMatch[1].trim() : 'Get Started',
          formFields: fieldsMatch ? fieldsMatch[1].split(',').map(f => f.trim()) : ['Name', 'Email', 'Phone']
        };
      }
    });
    
    return Object.keys(leadMagnets).length > 0 ? leadMagnets : generateFallbackLeadMagnet();
  };

  const generateFallbackPosts = () => [{
    id: 1,
    platform: 'Social Media',
    copy: `${formData.projectName} in ${formData.city}\n\n${formData.usps || 'Premium project'}\n\nEnquire now!`,
    cta: 'Learn More'
  }];

  const generateFallbackAds = () => [{
    platform: 'Digital Ads',
    headline: `${formData.projectName} - ${formData.city}`,
    body: `Premium ${formData.projectType}. ${formData.usps || 'Excellent location'}`,
    cta: 'Enquire Now'
  }];

  const generateFallbackPrompts = () => [{
    id: 1,
    purpose: 'Hero Image',
    prompt: `${formData.projectType} project, ${formData.city}, modern architecture, professional photography`,
    suggestedUse: 'Website banner'
  }];

  const generateFallbackCalendar = () => [{
    week: 1,
    theme: 'Project Launch',
    content: 'Introduce key features',
    posts: generateFallbackWeekPosts()
  }];

  const generateFallbackWeekPosts = () => [
    { day: 'Monday', format: 'Image Post', platform: 'Instagram' },
    { day: 'Wednesday', format: 'Video', platform: 'Instagram' },
    { day: 'Friday', format: 'Article', platform: 'LinkedIn' },
    { day: 'Sunday', format: 'Carousel', platform: 'Facebook' }
  ];

  const generateFallbackTargeting = () => formData.targetAudience.map(aud => ({
    audience: aud,
    demographics: 'Age 25-60',
    interests: 'Real estate, investments',
    platforms: 'Facebook, Instagram',
    adFormats: 'All formats',
    geos: formData.city
  }));

  const generateFallbackLeadMagnet = () => ({
    calculator: {
      headline: `ROI Calculator`,
      subheading: 'Calculate returns',
      body: 'See your investment potential.',
      cta: 'Calculate',
      formFields: ['Name', 'Email', 'Phone']
    },
    brochure: {
      headline: `Download Brochure`,
      subheading: 'Complete details',
      body: 'Get full project information.',
      cta: 'Download',
      formFields: ['Name', 'Email', 'Phone']
    },
    virtualtour: {
      headline: `Virtual Tour`,
      subheading: 'Experience remotely',
      body: 'Book your virtual walkthrough.',
      cta: 'Book Tour',
      formFields: ['Name', 'Email', 'Phone']
    },
    enquiry: {
      headline: `Enquire Now`,
      subheading: 'Get exclusive offers',
      body: 'Connect with our team.',
      cta: 'Enquire',
      formFields: ['Name', 'Email', 'Phone', 'Message']
    }
  });

  const downloadContent = () => {
    let content = `Real Estate Marketing Content - ${formData.projectName}\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
    content += `=== SOCIAL MEDIA POSTS ===\n\n`;
    generatedContent.socialPosts.forEach(post => {
      content += `${post.platform}\n${post.copy}\nCTA: ${post.cta}\n\n---\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.projectName}-marketing.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
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
                <p className="text-xs text-slate-400">AI-Powered Content Generation</p>
              </div>
            </div>
            {generatedContent && (
              <button
                onClick={downloadContent}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            )}
          </div>
        </div>
      </header>

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

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'input' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl border border-blue-700/50 p-6 mb-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Hugging Face AI Integration</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    Enter your Hugging Face API token for creative AI-generated content. Get your free token at huggingface.co/settings/tokens
                  </p>
                  <div className="flex gap-3 mb-3">
                    <input
                      type="password"
                      value={formData.apiKey}
                      onChange={(e) => handleInputChange('apiKey', e.target.value)}
                      placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    />
                    <button
                      onClick={testApiKey}
                      disabled={!formData.apiKey || isGenerating}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 rounded-lg text-sm font-medium transition whitespace-nowrap"
                    >
                      {isGenerating ? 'Testing...' : 'Test API Key'}
                    </button>
                    <a
                      href="https://huggingface.co/settings/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition whitespace-nowrap"
                    >
                      Get Token
                    </a>
                  </div>
                  {apiKeyValid === true && (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      API token is valid and working!
                    </div>
                  )}
                  {apiKeyValid === false && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      API token validation failed
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-200">{error}</p>
                  <p className="text-xs text-red-300 mt-1">Need help? Check huggingface.co/settings/tokens for API status</p>
                </div>
              </div>
            )}

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-400" />
                Project Details
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Project Type</label>
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

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
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

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
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

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Target Audience</label>
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
                    Generate AI Content
                  </>
                )}
              </button>
              
              {isGenerating && (
                <p className="text-center text-sm text-slate-400 mt-3">
                  AI is researching and creating unique content... This takes 60-120 seconds.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'results' && generatedContent && (
          <div className="space-y-6">
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

      <footer className="bg-slate-800/50 border-t border-slate-700 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>Real Estate Marketing Automation Tool • AI-Powered by Hugging Face</p>
          <p className="mt-1 text-xs">Built for HNI, UHNI, NRI & Corporate Investors</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
