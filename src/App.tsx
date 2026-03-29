import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { CalculatorTool } from './components/Tools/Calculator/CalculatorTool';
import { NotesPadTool } from './components/Tools/NotesPad/NotesPadTool';
import { PassGenTool } from './components/Tools/PassGen/PassGenTool';
import { UnitXTool } from './components/Tools/UnitX/UnitXTool';
import { ChronoTool } from './components/Tools/Chrono/ChronoTool';
import { ColorTool } from './components/Tools/ColorTool/ColorTool';
import { TaskFlow } from './components/Tools/TaskFlow/TaskFlow';
import { BodyMetric } from './components/Tools/BodyMetric/BodyMetric';
import { TipMaster } from './components/Tools/TipMaster/TipMaster';
import { MorseLink } from './components/Tools/MorseLink/MorseLink';
import { JSONSync } from './components/Tools/JSONSync/JSONSync';
import { MarkEdit } from './components/Tools/MarkEdit/MarkEdit';
import { QRBox } from './components/Tools/QRBox/QRBox';
import { WeatherTool } from './components/Tools/Weather/WeatherTool';
import { WorldClock } from './components/Tools/WorldClock/WorldClock';
import { CompassTool } from './components/Tools/Compass/CompassTool';
import { ClaudeAITool } from './components/Tools/ClaudeAI/ClaudeAITool';
import { ChatGPTTool } from './components/Tools/ChatGPT/ChatGPTTool';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calculator" element={<CalculatorTool />} />
          <Route path="/notes" element={<NotesPadTool />} />
          <Route path="/passgen" element={<PassGenTool />} />
          <Route path="/units" element={<UnitXTool />} />
          <Route path="/chrono" element={<ChronoTool />} />
          <Route path="/colors" element={<ColorTool />} />
          <Route path="/tasks" element={<TaskFlow />} />
          <Route path="/bmi" element={<BodyMetric />} />
          <Route path="/tips" element={<TipMaster />} />
          <Route path="/morse" element={<MorseLink />} />
          <Route path="/json" element={<JSONSync />} />
          <Route path="/markdown" element={<MarkEdit />} />
          <Route path="/qr" element={<QRBox />} />
          <Route path="/weather" element={<WeatherTool />} />
          <Route path="/worldclock" element={<WorldClock />} />
          <Route path="/compass" element={<CompassTool />} />
          <Route path="/claude" element={<ClaudeAITool />} />
          <Route path="/chatgpt" element={<ChatGPTTool />} />
          
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
