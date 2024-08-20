import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Box, CircularProgress } from '@mui/material';

const Homepage = lazy(() => import('./Pages/Homepage/Homepage.jsx'));
const LoginPage = lazy(() => import('./Pages/Login/LoginPage.jsx'));

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
            <CircularProgress />
          </Box>}>


        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<Homepage />} />
          
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
