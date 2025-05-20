// This is a simple QR code generation utility
// In a production app, you'd use a proper QR code library like qrcode.react

export function generateQRCode(data: string): string {
  // In a real implementation, we would use a QR code library to generate an actual QR code
  // For this demo, we'll just return a placeholder URL
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
}

export function parseQRCode(qrData: string): {
  bookingId: string;
  timestamp: string;
  random: string;
} | null {
  try {
    // Sample format: REART-BOOKING-1647521896123-abc123
    const parts = qrData.split('-');
    if (parts.length !== 4 || parts[0] !== 'REART' || parts[1] !== 'BOOKING') {
      return null;
    }
    
    return {
      bookingId: parts[1],
      timestamp: parts[2],
      random: parts[3]
    };
  } catch (error) {
    console.error('Error parsing QR code:', error);
    return null;
  }
}
