# OpenAGI - Visual LLM Workflow Builder

A React-based visual workflow builder for creating and managing LLM (Language Learning Model) applications. This project allows users to create workflows by connecting different nodes (Input, LLM Engine, Output) and interact with various AI models including OpenAI's GPT and Google's Gemini.

## Features

- Visual workflow builder with drag-and-drop interface
- Support for multiple LLM providers (OpenAI and Gemini)
- Real-time preview of workflow outputs
- Customizable node configurations
- Responsive design

## Technologies Used

- **React** - Frontend framework
- **Vite** - Build tool and development server
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - React components library
- **React Flow** (@xyflow/react) - Flow visualization library
- **OpenAI & Gemini APIs** - LLM providers
- **React Query** (@tanstack/react-query) - Data fetching and state management
- **Lucide React** - Icon library

## Project Structure

```
src/
├── components/
│   ├── nodes/           # Flow nodes components
│   │   ├── InputNode.tsx
│   │   ├── LLMNode.tsx
│   │   ├── OutputNode.tsx
│   │   └── llm/        # LLM node subcomponents
│   │       ├── ApiKeyInput.tsx
│   │       ├── ModelSelector.tsx
│   │       └── ProviderSelector.tsx
│   └── workflow/        # Workflow-related components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── WorkflowExecutor.tsx
├── services/
│   └── api-service.ts   # API integration service
├── utils/
│   ├── openai-errors.ts # OpenAI error handling
│   └── workflow-utils.ts # Workflow utility functions
└── pages/
    └── Index.tsx        # Main application page
```

## Component Details

### Node Components

1. **InputNode**
   - Handles user input text
   - Validates input before processing
   - Provides real-time feedback

2. **LLMNode**
   - Configures LLM settings (model, temperature, tokens)
   - Manages API keys for different providers
   - Handles provider selection (OpenAI/Gemini)

3. **OutputNode**
   - Displays LLM responses
   - Shows loading states
   - Handles error messages

### Workflow Components

1. **Header**
   - Project navigation
   - Workflow execution controls
   - Deployment options

2. **Sidebar**
   - Node type selection
   - Drag-and-drop functionality
   - Component organization

3. **WorkflowExecutor**
   - Manages workflow execution
   - Handles API calls
   - Updates node states

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- OpenAI API key (for ChatGPT)
- Gemini API key (for Google's Gemini)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd openagi
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:8080`

### Building for Production

```bash
npm run build
# or
yarn build
```

## Usage

1. Drag nodes from the sidebar onto the canvas
2. Connect nodes by dragging from one handle to another
3. Configure the LLM node with your API key and preferences
4. Enter your prompt in the input node
5. Click "Run" to execute the workflow

## Error Handling

The application includes comprehensive error handling for:
- API quota exceeded
- Invalid API keys
- Model availability
- Network issues
- Input validation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.