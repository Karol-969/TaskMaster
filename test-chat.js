// Simple Node.js test script to verify chat functionality
const WebSocket = require('ws');

console.log('🧪 Testing ReArt Events Chat Functionality');
console.log('==========================================');

// Test 1: WebSocket Connection
console.log('\n1. Testing WebSocket Connection...');

try {
  const ws = new WebSocket('ws://localhost:5000/ws');
  
  ws.on('open', function open() {
    console.log('✅ WebSocket connection established');
    
    // Test AI Assistant message
    console.log('\n2. Testing AI Assistant...');
    const testMessage = {
      type: 'user',
      content: 'What services does ReArt Events offer?',
      timestamp: new Date().toISOString()
    };
    
    ws.send(JSON.stringify(testMessage));
  });

  ws.on('message', function message(data) {
    try {
      const response = JSON.parse(data.toString());
      console.log('📨 Received response:');
      console.log('Type:', response.type);
      console.log('Content:', response.content);
      
      if (response.type === 'system') {
        console.log('✅ System welcome message received');
      } else if (response.type === 'ai') {
        console.log('✅ AI response received');
        console.log('🤖 AI Response preview:', response.content.substring(0, 100) + '...');
        
        // Test human support next
        console.log('\n3. Testing Human Support...');
        const humanMessage = {
          type: 'admin',
          content: 'I need help with booking an artist',
          timestamp: new Date().toISOString()
        };
        ws.send(JSON.stringify(humanMessage));
      } else if (response.type === 'admin') {
        console.log('✅ Human support response received');
        
        // Close connection after successful tests
        setTimeout(() => {
          console.log('\n4. All tests completed successfully! 🎉');
          console.log('\nChat functionality is working:');
          console.log('✅ WebSocket connection');
          console.log('✅ AI Assistant responses');
          console.log('✅ Human support routing');
          ws.close();
          process.exit(0);
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error);
    }
  });

  ws.on('error', function error(err) {
    console.error('❌ WebSocket error:', err.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check if server is running on port 5000');
    console.log('2. Verify WebSocket server is properly configured');
    console.log('3. Check firewall settings');
    process.exit(1);
  });

  ws.on('close', function close() {
    console.log('🔌 WebSocket connection closed');
  });

  // Timeout after 10 seconds
  setTimeout(() => {
    console.error('❌ Test timeout - no response received');
    ws.close();
    process.exit(1);
  }, 10000);

} catch (error) {
  console.error('❌ Failed to create WebSocket connection:', error.message);
  process.exit(1);
}