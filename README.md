# Apex Task Manager

## AI-Powered Task Management System

A sophisticated task management system designed for multi-business operations with AI-powered features.

### 🚀 Features

- **AI-Powered Task Assignment** - Smart recommendations based on skills, workload, and success rates
- **Real-time Collaboration** - Live updates and notifications
- **Role-Based Permissions** - Admin, VIP Partners, Managers, Staff, and External user roles
- **Multi-Business Unit Support** - Manage tasks across different business units
- **Gemini AI Integration** - Advanced task validation and business intelligence
- **Mobile-First Design** - Responsive design optimized for mobile devices
- **Dark/Light Theme** - Professional themes with smooth transitions
- **Offline Support** - PWA capabilities for offline functionality

### 🛠 Tech Stack

- **Frontend**: Vue 3, Vite, Tailwind CSS, Pinia
- **Backend**: Firebase (Firestore, Auth, Functions, Storage)
- **AI**: Google Gemini AI
- **Deployment**: Vercel
- **Real-time**: Firebase Real-time Database

### 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/LuxusEle/Apex-Task.git
cd Apex-Task
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your actual credentials
```

4. Start development server:
```bash
npm run dev
```

### 🔧 Configuration

#### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Google Sign-in)
3. Set up Firestore database
4. Configure Firebase hosting (optional)

#### Gemini AI Setup
1. Get API key from Google AI Studio
2. Add to environment variables

#### Vercel Deployment
1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### 📁 Project Structure

```
apex-task/
├── src/
│   ├── components/          # Vue components
│   ├── views/              # Page components
│   ├── stores/             # Pinia stores
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── router/             # Vue Router config
│   └── assets/             # Static assets
├── functions/              # Firebase Functions
├── public/                 # Public assets
└── docs/                   # Documentation
```

### 🎯 User Roles

- **Admin**: Full system control
- **VIP Partner**: High-level task management
- **Manager**: Team and department management
- **Staff**: Task execution and basic management
- **External**: Limited access for external collaborators

### 🤖 AI Features

#### Task Assignment Intelligence
- Skill matching algorithm
- Workload balancing
- Historical performance analysis
- Success rate prediction

#### Validation System
- Rejection reason analysis
- Professional language checking
- Context relevance validation
- Override code system (123, 456, 789)

#### Business Intelligence
- Performance analytics
- Team optimization suggestions
- Risk assessment
- Productivity insights

### 📱 Mobile Features

- Responsive design
- Touch-optimized interface
- Push notifications
- Offline synchronization
- PWA installation

### 🔐 Security

- Firebase Authentication
- Role-based access control
- Data validation
- Secure API endpoints
- HTTPS enforcement

### 📊 Analytics

- Task completion rates
- User performance metrics
- Business unit analytics
- AI suggestion accuracy
- System usage patterns

### 🚀 Deployment

#### Development
```bash
npm run dev
```

#### Build
```bash
npm run build
```

#### Deploy to Vercel
```bash
npm run deploy
```

### 🔧 Environment Variables

See `.env.example` for required environment variables.

### 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🆘 Support

For support, email support@apextask.com or create an issue on GitHub.

### 🏢 Business Context

Designed for managing:
- PeoplesBank operations (highest priority)
- Fintech partnerships
- Cabinet businesses (Infinity & Luxus)
- CAD/CAM CNC applications (Cabinetrix)
- Personal tasks and family management
- New Zealand relocation planning

### 📈 Roadmap

- [ ] Advanced AI chatbot
- [ ] Voice commands
- [ ] Calendar integration
- [ ] Advanced reporting
- [ ] Mobile apps
- [ ] API for third-party integrations
- [ ] Multi-language support
- [ ] Advanced workflow automation

---

**Built with ❤️ for efficient multi-business management**