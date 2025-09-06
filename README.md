# Real Estate Personalization with n8n & Flux Labs

🏠 **Transform empty apartments into personalized dream homes using AI-powered image generation**

Sourabh, Benny, Juan, and Sanyukta bring you apartment personalization with image generation!

## 🎯 Project Overview

This project helps renters and buyers visualize how their empty apartment will look after they move in and personalize it according to their taste. We use AI image generation to transform empty rooms into beautifully furnished, personalized spaces.

### Key Features

- **User Preference Collection**: Gather detailed user preferences (age, lifestyle, hobbies, family status, etc.)
- **AI-Powered Style Matching**: Use LLM to match user preferences with predefined aesthetic vibes
- **Image Generation**: Transform empty room photos into personalized, furnished spaces using Flux Labs
- **Real-time Processing**: Asynchronous image generation with polling and webhook support
- **Responsive Web Interface**: Modern, user-friendly frontend for seamless experience

## 🏗️ Architecture

```
User Input → n8n Workflow → LLM Style Matching → Flux Image Generation → Personalized Room Images
```

### Technology Stack

- **Workflow Automation**: n8n
- **Image Generation**: BlackForest Labs / Flux
- **LLM Integration**: OpenAI/Anthropic for style matching
- **Frontend**: Next.js/React
- **Backend**: Node.js/Express
- **Database**: PostgreSQL
- **Caching**: Redis

## 📁 Project Structure

```
/
├── .github/workflows/          # CI/CD automation
├── docs/                       # Project documentation
├── n8n-workflows/             # n8n workflow JSON files
│   └── flux/                  # Flux-specific workflows
├── scripts/                   # Helper scripts and utilities
├── assets/                    # Images, samples, demo outputs
│   ├── images/               # Sample room images
│   └── samples/              # Demo data and outputs
├── templates/                 # Reusable n8n templates
├── blackforest/              # Flux Labs integration
│   ├── api/                  # API helpers
│   ├── prompts/              # Prompt templates
│   └── templates/            # Style templates
├── src/                      # Source code
│   ├── backend/              # Backend API
│   ├── frontend/             # Frontend application
│   ├── database/             # Database schemas and migrations
│   └── llm/                  # LLM integration and prompts
├── tests/                    # Test suites
└── config/                   # Configuration files
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- n8n instance
- BlackForest Labs API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sourabhbhalke/n8n_X_blackforest_hackathon.git
   cd n8n_X_blackforest_hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

4. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Import n8n workflows**
   ```bash
   npm run n8n:import
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Key environment variables you need to configure:

- `FLUX_API_KEY`: Your BlackForest Labs API key
- `OPENAI_API_KEY`: OpenAI API key for LLM integration
- `DATABASE_URL`: PostgreSQL connection string
- `N8N_WEBHOOK_URL`: Your n8n webhook URL

See `env.example` for the complete list.

### n8n Setup

1. Import the workflows from `n8n-workflows/flux/`
2. Configure your API credentials in n8n
3. Set up webhooks for async processing

## 🎨 User Flow

1. **User Input Collection**
   - Age, gender, income level
   - Family status (single, couple, family with kids)
   - Pets, hobbies, occupation
   - Cooking habits, lifestyle preferences

2. **Style Matching**
   - LLM analyzes user preferences
   - Matches with predefined aesthetic vibes
   - Generates personalized style description

3. **Image Generation**
   - Takes empty room photo from listing
   - Combines with style preferences
   - Generates furnished, personalized room image

4. **Result Delivery**
   - Asynchronous processing with real-time updates
   - High-quality, Pinterest-worthy room images
   - Multiple style options for comparison

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
```

## 📚 Documentation

- [API Documentation](docs/api.md)
- [n8n Workflow Guide](docs/n8n-setup.md)
- [Flux Integration](docs/flux-setup.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Sourabh** - Project Lead & Backend
- **Benny** - Frontend & UI/UX
- **Juan** - n8n Workflows & Integration
- **Sanyukta** - AI/ML & Image Processing

## 🙏 Acknowledgments

- BlackForest Labs for the amazing Flux image generation API
- n8n team for the powerful workflow automation platform
- The hackathon organizers for this incredible opportunity

---

**Built with ❤️ for the n8n X BlackForest Hackathon**
