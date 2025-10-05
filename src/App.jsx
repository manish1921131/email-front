import { Container, Box, FormControl, InputLabel, Select, MenuItem, TextField, Typography, Button, CircularProgress } from '@mui/material'
import axios from 'axios';
import { useState } from 'react'

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Use your EC2 IP directly with HTTPS
      const response = await axios.post("http://13.60.219.40:9090/api/email/generate", {
        emailContent,
        tone: tone || 'professional'
      });
      
      // DIRECTLY USE THE RESPONSE - NO JSON PARSING NEEDED
      let replyText = response.data;
      
      // Just clean up basic formatting
      replyText = replyText
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .trim();
      
      setGeneratedReply(replyText);
    } catch (error) {
      console.error('Error:', error);
      setGeneratedReply('Error generating reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ p: 4, background: '#f8fbfcff', minHeight: '100vh' }}>
      <Typography variant='h3' component="h1" gutterBottom sx={{ 
        textAlign: 'center', 
        color: '#1e293b',
        fontWeight: 'bold',
        mb: 4
      }}>
        Email Reply Generator
      </Typography>
    
      <TextField
        fullWidth
        multiline
        rows={6}
        variant='outlined'
        label="Paste email content here"
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        sx={{ mb: 3, background: 'white' }}
      />

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Tone Style</InputLabel>
          <Select
            value={tone}
            label="Tone Style"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button 
        variant="contained" 
        onClick={handleSubmit}
        disabled={!emailContent || loading}
        sx={{ 
          mb: 3, 
          background: 'linear-gradient(45deg, #ec4899, #8b5cf6)',
          fontSize: '1rem',
          fontWeight: 'bold',
          py: 1.5,
          '&:hover': {
            background: 'linear-gradient(45deg, #db2777, #7c3aed)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
          },
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
        }}
        fullWidth
      >
        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Generate Reply"}
      </Button>
      
      <TextField
        fullWidth
        multiline
        rows={6}
        variant='outlined'
        label="Generated Reply"
        value={generatedReply}
        inputProps={{ readOnly: true }}
        sx={{ background: 'white', mb: 2 }}
      />

      <Button 
        variant='outlined'
        onClick={() => navigator.clipboard.writeText(generatedReply)}
        disabled={!generatedReply}
        sx={{ 
          borderColor: '#8b5cf6',
          color: '#1c0653ff',
          '&:hover': {
            borderColor: '#7c3aed',
            background: 'rgba(139, 92, 246, 0.04)',
            transform: 'scale(1.02)'
          },
          transition: 'all 0.2s ease'
        }}
        fullWidth
      >
        Copy to Clipboard
      </Button>
    </Container>
  )
}

export default App