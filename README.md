proj_uscollegehub

## Setup Instructions

### Frontend Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`

### Backend Setup
1. Navigate to backend directory: `cd backend`
2. Install Python dependencies: `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and add your College Scorecard API key
4. Start backend server: `python app.py`

### Getting College Scorecard API Key
1. Visit https://api.data.gov/signup/
2. Sign up for a free API key
3. Add the key to your `backend/.env` file

### Running Both Services
- Frontend: `npm run dev` (runs on http://localhost:5173)
- Backend: `npm run dev:backend` (runs on http://localhost:5000)

## Features

- **Profile Analysis**: Calculate rigor scores using advanced algorithms
- **School Recommendations**: Get personalized university recommendations
- **Application Checklist**: Track completion of application components
- **School Comparison**: Compare universities side-by-side
- **Real-time Scoring**: Backend integration for accurate calculations
