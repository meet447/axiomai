# AxiomAI Chat

AxiomAI is a modern, lightweight AI chat application that provides instant access to advanced language models without requiring any sign-up or authentication. Experience seamless conversations with state-of-the-art AI models in a beautiful, responsive interface.

![AxiomAI Preview](public/landing.png)

## ✨ Features

### 🚀 Instant Access
- No account required
- Start chatting immediately
- Zero setup time

### 🔒 Privacy First
- No data storage
- No conversation history saved on servers
- Complete privacy protection

### 🤖 Multiple AI Models
- Llama 3.3 70B - Advanced language model for complex tasks
- DeepSeek R1 - Specialized in analytical thinking
- Llama Vision - Image analysis capabilities
- Gemma 2 27B - Google's latest language model

### 🖼️ Image Analysis
- Upload and analyze images
- AI-powered image understanding
- Visual context in conversations

### 💫 Modern UI/UX
- Clean, intuitive interface
- Dark/Light mode support
- Responsive design for all devices
- Real-time streaming responses
- Markdown support with syntax highlighting

## 🛠️ Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Shadcn/ui components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/meet447/axiomai.git
cd axiomai
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and visit `http://localhost:8080`

## 🔧 Development

### Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
└── styles/         # Global styles and Tailwind config
```

### Key Components

- `Chat.tsx`: Main chat interface
- `ChatSidebar.tsx`: Chat history and model selection
- `Navbar.tsx`: Application navigation

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Vite](https://vitejs.dev) for the blazing fast build tool