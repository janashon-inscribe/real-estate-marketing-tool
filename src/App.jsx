import React, { useState } from 'react';
import { Building2, Home, Factory, Download, Calendar, Target, Lightbulb, FileText, TrendingUp } from 'lucide-react';

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
    contentNeeds: []
  });
  const [generatedContent, setGeneratedContent] = useState(null);

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
  };

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const generateContent = () => {
    const content = {
      socialPosts: generateSocialPosts(),
      adCopies: generateAdCopies(),
      creativePrompts: generateCreativePrompts(),
      campaignCalendar: generateCampaignCalendar(),
      targetingSuggestions: generateTargetingSuggestions(),
      leadMagnetCopy: generateLeadMagnetCopy()
    };
    setGeneratedContent(content);
    setActiveTab('results');
  };

  const generateSocialPosts = () => {
    const posts = [];
    const projectTypeDescriptions = {
      residential: ['luxury living', 'dream home', 'premium lifestyle', 'modern amenities'],
      commercial: ['business hub', 'growth catalyst', 'strategic location', 'premium office space'],
      industrial: ['logistics excellence', 'manufacturing advantage', 'connectivity', 'investment opportunity']
    };

    const descriptions = projectTypeDescriptions[formData.projectType];
    
    for (let i = 0; i < 10; i++) {
      const platforms = ['Facebook & Instagram', 'LinkedIn', 'Twitter/X'];
      const platform = platforms[i % 3];
      
      posts.push({
        id: i + 1,
        platform,
        copy: `🏢 ${formData.projectName || 'Your Project'} - Where ${descriptions[i % descriptions.length]} meets excellence!\n\n${formData.city ? `📍 Located in prime ${formData.city}` : '📍 Prime location'} ${formData.landmark ? `near ${formData.landmark}` : ''}\n\n✨ ${formData.usps || 'Premium features and world-class amenities'}\n\n${formData.targetAudience.includes('NRIs') ? '🌍 Perfect for NRI investors seeking quality and returns\n' : ''}${formData.targetAudience.includes('HNIs') ? '💎 Designed for discerning high-net-worth individuals\n' : ''}\n📞 Enquire now for exclusive pre-launch offers!\n\n#RealEstate #${formData.projectType === 'residential' ? 'LuxuryHomes' : formData.projectType === 'commercial' ? 'CommercialRealEstate' : 'IndustrialPark'} #Investment #${formData.city || 'PrimeLocation'} #${formData.developer?.replace(/\s+/g, '') || 'Premium'}Developments`,
        cta: 'Learn More | Book Site Visit | Download Brochure'
      });
    }
    return posts;
  };

  const generateAdCopies = () => {
    return [
      {
        platform: 'Facebook Lead Ads',
        headline: `${formData.projectName || 'Premium Project'} - ${formData.city || 'Prime Location'}`,
        body: `Discover ${formData.projectType} excellence. ${formData.usps || 'World-class amenities, strategic location, and guaranteed returns'}. ${formData.targetAudience.includes('NRIs') ? 'NRI-friendly investments.' : ''} Limited units available.`,
        cta: 'Get Exclusive Details'
      },
      {
        platform: 'Google Search Ads',
        headline: `${formData.projectType.charAt(0).toUpperCase() + formData.projectType.slice(1)} in ${formData.city || 'Prime Area'} | ${formData.developer || 'Premium Developer'}`,
        body: `RERA Approved ${formData.projectType} project. ${formData.usps || 'Premium location, modern amenities'}. Site visits available. Enquire now!`,
        cta: 'Book Site Visit'
      },
      {
        platform: 'LinkedIn Sponsored Content',
        headline: `Strategic ${formData.projectType.charAt(0).toUpperCase() + formData.projectType.slice(1)} Investment Opportunity`,
        body: `${formData.projectName || 'Our latest project'} offers institutional-grade ${formData.projectType} assets. ${formData.targetAudience.includes('Corporates') ? 'Perfect for corporate expansion and asset diversification.' : 'Ideal for portfolio diversification.'} High ROI potential.`,
        cta: 'Download Investment Brief'
      },
      {
        platform: 'Instagram Story Ads',
        headline: `Your ${formData.projectType === 'residential' ? 'Dream Home' : 'Investment'} Awaits`,
        body: `Swipe up to explore ${formData.projectName || 'this premium project'}. ${formData.city ? `Located in ${formData.city}` : 'Prime location'}. Limited offer!`,
        cta: 'Swipe Up'
      },
      {
        platform: 'YouTube Pre-Roll',
        headline: `${formData.projectName || 'Premium Project'} - Redefining ${formData.projectType.charAt(0).toUpperCase() + formData.projectType.slice(1)} Excellence`,
        body: `Experience luxury and returns combined. Watch our virtual tour and discover why investors choose ${formData.developer || 'us'}. ${formData.usps || 'Premium amenities, strategic location, RERA approved'}.`,
        cta: 'Watch Virtual Tour'
      }
    ];
  };

  const generateCreativePrompts = () => {
    const promptsByType = {
      residential: [
        'Photorealistic luxury apartment tower with infinity pool on rooftop, golden hour sunset, modern glass facade, people enjoying poolside, cityscape background, 4K quality',
        'Elegant 4BHK apartment interior, marble flooring, floor-to-ceiling windows, modern furniture, natural lighting, plants, premium finishes, architectural photography',
        'Aerial drone view of gated residential community, landscaped gardens, clubhouse, children playing in park, security gates, wide roads, evening lights',
        'Modern residential lobby with chandelier, concierge desk, marble walls, luxury seating area, professional lighting, welcoming atmosphere',
        'Family enjoying balcony view with coffee, sunrise, city skyline, happy moments, lifestyle photography'
      ],
      commercial: [
        'Modern Grade-A office building with glass facade, business professionals walking, urban skyline, blue hour, corporate architecture, premium aesthetic',
        'Spacious office interior with workstations, meeting rooms visible through glass, natural light, professional team working, modern furniture, tech-enabled workspace',
        'Commercial complex entrance with landscaping, parking area, signage, people entering, professional atmosphere, daytime photography',
        'Conference room with city view, executive meeting, large table, presentation screen, professional setting, high-end finishes',
        'Office building at night with lit windows, creating pattern, urban context, architectural beauty, corporate excellence'
      ],
      industrial: [
        'Large industrial park aerial view, warehouses in rows, wide roads, trucks moving, greenery, organized layout, logistics hub, professional photography',
        'Modern warehouse interior with high ceilings, organized inventory, forklifts, workers, efficient operations, clean industrial space',
        'Industrial park entrance with security gate, signage, landscaping, wide roads, professional appearance, daytime clear weather',
        'Loading dock area with trucks, efficient operations, workers coordinating, safety measures visible, organized industrial facility',
        'Bird\'s eye view of industrial township with manufacturing units, green belt, connectivity to highways, planned infrastructure'
      ]
    };

    return promptsByType[formData.projectType].map((prompt, index) => ({
      id: index + 1,
      purpose: ['Hero Image', 'Interior Showcase', 'Aerial View', 'Amenity Highlight', 'Lifestyle Visual'][index],
      prompt,
      suggestedUse: ['Website banner, Facebook cover', 'Instagram post, brochure', 'LinkedIn article hero', 'Instagram stories, reels', 'Social media posts'][index]
    }));
  };

  const generateCampaignCalendar = () => {
    const themes = {
      residential: [
        { theme: 'Project Launch & Brand Introduction', content: 'Teaser posts, developer legacy, project vision' },
        { theme: 'Location Advantage', content: 'Connectivity, nearby landmarks, lifestyle amenities' },
        { theme: 'Luxury & Amenities', content: 'Clubhouse, pool, gym, landscaping features' },
        { theme: 'Investment & ROI Focus', content: 'Appreciation potential, rental yields, market analysis' },
        { theme: 'Limited Inventory Urgency', content: 'Units selling fast, early bird offers, booking process' }
      ],
      commercial: [
        { theme: 'Strategic Business Location', content: 'Connectivity, business district, accessibility' },
        { theme: 'Grade-A Specifications', content: 'Infrastructure, modern amenities, tech-ready spaces' },
        { theme: 'Corporate Tenant Success Stories', content: 'Similar projects, occupancy rates, tenant testimonials' },
        { theme: 'ROI & Capital Appreciation', content: 'Rental returns, market growth, investment benefits' },
        { theme: 'Flexible Spaces & Booking', content: 'Custom configurations, booking process, site visits' }
      ],
      industrial: [
        { theme: 'Connectivity & Logistics Hub', content: 'Highway access, ports, airports, transport advantages' },
        { theme: 'Infrastructure Excellence', content: 'Power supply, water, drainage, road network' },
        { theme: 'Government Support & Incentives', content: 'Tax benefits, subsidies, special zones' },
        { theme: 'Investor Returns & Growth', content: 'Rental yields, appreciation, demand analysis' },
        { theme: 'Ready to Move & Booking', content: 'Immediate possession, documentation, site tours' }
      ]
    };

    const calendar = [];
    const selectedThemes = themes[formData.projectType];
    
    for (let week = 1; week <= 4; week++) {
      const themeIndex = (week - 1) % selectedThemes.length;
      calendar.push({
        week,
        theme: selectedThemes[themeIndex].theme,
        content: selectedThemes[themeIndex].content,
        posts: [
          { day: 'Monday', format: 'Carousel Post', platform: 'Instagram/Facebook' },
          { day: 'Wednesday', format: 'Reel/Video', platform: 'Instagram/YouTube' },
          { day: 'Friday', format: 'Article/Blog', platform: 'LinkedIn' },
          { day: 'Sunday', format: 'Testimonial/Update', platform: 'All Platforms' }
        ]
      });
    }
    
    return calendar;
  };

  const generateTargetingSuggestions = () => {
    const suggestions = [];
    
    formData.targetAudience.forEach(audience => {
      switch(audience) {
        case 'HNIs':
          suggestions.push({
            audience: 'High Net Worth Individuals (HNIs)',
            demographics: 'Age 35-60, Income $200K+',
            interests: 'Luxury lifestyle, investments, real estate, private equity, wealth management',
            platforms: 'LinkedIn, Instagram, Facebook',
            adFormats: 'Carousel ads, video ads, lead forms',
            geos: `${formData.city || 'Major metros'}, Tier-1 cities`
          });
          break;
        case 'UHNIs':
          suggestions.push({
            audience: 'Ultra High Net Worth Individuals (UHNIs)',
            demographics: 'Age 40-65, Net Worth $5M+',
            interests: 'Luxury real estate, portfolio diversification, exclusive investments, art & collectibles',
            platforms: 'LinkedIn, Instagram (premium placements)',
            adFormats: 'Video testimonials, exclusive webinar invites, personalized outreach',
            geos: 'Mumbai, Delhi, Bangalore, international metros'
          });
          break;
        case 'NRIs':
          suggestions.push({
            audience: 'Non-Resident Indians (NRIs)',
            demographics: 'Age 30-55, Indian diaspora',
            interests: 'India real estate, investment opportunities, NRI banking, homeland connections',
            platforms: 'Facebook, LinkedIn, WhatsApp Business',
            adFormats: 'Video tours, ROI calculators, NRI-specific content',
            geos: 'UAE (Dubai), Singapore, USA (Bay Area, New York), UK (London), Canada (Toronto), Australia'
          });
          break;
        case 'Corporates':
          suggestions.push({
            audience: 'Corporate Decision Makers',
            demographics: 'CXOs, CFOs, Real Estate Heads, Age 35-55',
            interests: 'Commercial real estate, corporate expansion, asset management, business growth',
            platforms: 'LinkedIn (primary), industry publications',
            adFormats: 'Sponsored content, investment briefs, case studies',
            geos: `${formData.city || 'Business hubs'}, IT corridors, industrial zones`
          });
          break;
        case 'Retail Investors':
          suggestions.push({
            audience: 'Retail Investors',
            demographics: 'Age 25-45, Income $50K-150K',
            interests: 'Real estate investment, wealth building, financial planning, property ownership',
            platforms: 'Facebook, Instagram, Google Search',
            adFormats: 'Lead ads, search ads, carousel posts',
            geos: `${formData.city || 'Local markets'}, nearby cities`
          });
          break;
        case 'Institutional Investors':
          suggestions.push({
            audience: 'Institutional Investors',
            demographics: 'Investment firms, REITs, PE funds',
            interests: 'Commercial real estate, large-scale projects, portfolio assets, development opportunities',
            platforms: 'LinkedIn, direct outreach, industry events',
            adFormats: 'Detailed investment briefs, data sheets, exclusive presentations',
            geos: 'National & international financial centers'
          });
          break;
      }
    });
    
    return suggestions.length > 0 ? suggestions : [{
      audience: 'General Audience',
      demographics: 'Age 25-60, Middle to high income',
      interests: 'Real estate, property investment, home ownership',
      platforms: 'Facebook, Instagram, Google Search',
      adFormats: 'All formats',
      geos: formData.city || 'Target location'
    }];
  };

  const generateLeadMagnetCopy = () => {
    return {
      roiCalculator: {
        headline: `Calculate Your Returns: ${formData.projectName || 'Investment'} ROI Calculator`,
        subheading: `Discover the potential appreciation and rental returns from ${formData.projectName || 'this premium project'}`,
        body: `Enter your investment amount and see projected returns over 5-10 years. Our calculator factors in location appreciation, rental yields, and market trends in ${formData.city || 'the area'}. Get personalized insights instantly.`,
        cta: 'Calculate My Returns',
        formFields: ['Name', 'Email', 'Phone', 'Investment Budget', 'Investment Timeline']
      },
      brochure: {
        headline: `Download ${formData.projectName || 'Project'} Brochure - Complete Details Inside`,
        subheading: 'Your comprehensive guide to specifications, pricing, and payment plans',
        body: `Get the official brochure featuring:\n• Detailed floor plans and specifications\n• Pricing and payment schemes\n• Amenities and features\n• Location advantages and connectivity\n• Developer credentials and past projects\n${formData.usps ? `• ${formData.usps}` : ''}`,
        cta: 'Download Brochure (PDF)',
        formFields: ['Full Name', 'Email', 'Phone', 'Preferred Unit Type']
      },
      virtualTour: {
        headline: `Experience ${formData.projectName || 'The Project'} from Anywhere - Virtual Tour`,
        subheading: `${formData.targetAudience.includes('NRIs') ? 'Perfect for NRIs and remote investors!' : 'Explore without visiting in person'}`,
        body: `Join our exclusive virtual walkthrough and see:\n• ${formData.projectType === 'residential' ? 'Sample apartments and common areas' : formData.projectType === 'commercial' ? 'Office spaces and facilities' : 'Industrial park layout and infrastructure'}\n• Live Q&A with our sales team\n• Special offers for virtual tour attendees\n• 360° view of location and surroundings`,
        cta: 'Book Virtual Tour',
        formFields: ['Name', 'Email', 'Phone', 'Country/City', 'Preferred Date & Time']
      },
      enquiry: {
        headline: `Get Exclusive Pre-Launch Offers - Enquire Now`,
        subheading: 'Limited period offers for early investors',
        body: `Connect with our team to:\n• Get the best prices and units\n• Schedule site visit\n• Understand payment plans and financing\n• Discuss customization options\n• Receive investment guidance\n\n💬 Instant connect via WhatsApp or call`,
        cta: 'Enquire Now',
        whatsappCta: 'Chat on WhatsApp',
        formFields: ['Name', 'Email', 'Phone', 'Inquiry Type', 'Budget Range', 'Message']
      }
    };
  };

  const downloadContent = (format) => {
    let content = '';
    
    if (format === 'txt') {
      content = `Real Estate Marketing Content - ${formData.projectName || 'Project'}\n\n`;
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
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.projectName || 'project'}-marketing-content.txt`;
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
                <h1 className="text-xl font-bold">Real Estate Marketing Automation</h1>
                <p className="text-xs text-slate-400">AI-Powered Branding & Social Media Tool</p>
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
                onClick={generateContent}
                disabled={!formData.projectName || !formData.city || formData.targetAudience.length === 0}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Generate Marketing Content
              </button>
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
                {generatedContent.socialPosts.slice(0, 5).map(post => (
                  <div key={post.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-blue-400 uppercase">{post.platform}</span>
                      <span className="text-xs text-slate-400">Post #{post.id}</span>
                    </div>
                    <p className="text-sm whitespace-pre-line mb-3">{post.copy}</p>
                    <div className="text-xs text-green-400 font-medium">CTA: {post.cta}</div>
                  </div>
                ))}
                {generatedContent.socialPosts.length > 5 && (
                  <div className="text-center text-slate-400 text-sm">
                    + {generatedContent.socialPosts.length - 5} more posts available in export
                  </div>
                )}
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
          <p>Real Estate Marketing Automation Tool • Built for HNI, UHNI, NRI & Corporate Investors</p>
          <p className="mt-1 text-xs">Export your content and integrate with your marketing platforms</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
