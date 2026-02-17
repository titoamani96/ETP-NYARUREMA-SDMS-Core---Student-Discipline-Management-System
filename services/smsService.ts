
const API_KEY = "atsk_103cb38d70ae89106ffa8631db0f92af3ab5f78c3f2e87fd37dddd9abfe7c4d03ce41b29";
const USERNAME = "sandbox";
const BASE_URL = "https://api.sandbox.africastalking.com/version1/messaging";

export interface SMSSendResponse {
  status: 'Sent' | 'Failed';
  messageId?: string;
  error?: string;
}

/**
 * Sends an SMS using the Africa's Talking API.
 * Note: Direct browser-to-API calls usually encounter CORS restrictions.
 * This implementation follows the user's request for direct integration.
 */
export const sendActualSMS = async (to: string, message: string): Promise<SMSSendResponse> => {
  try {
    // Africa's Talking expects form-urlencoded data
    const details = {
      username: USERNAME,
      to: to,
      message: message,
    };

    const formBody = Object.entries(details)
      .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
      .join('&');

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'apiKey': API_KEY,
      },
      body: formBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Africa\'s Talking API Error:', errorText);
      return { status: 'Failed', error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    console.log('SMS Sent Successfully:', data);
    
    // Check if the recipient actually received it (parsed from API response)
    const recipient = data?.SMSMessageData?.Recipients?.[0];
    if (recipient && recipient.status === 'Success') {
      return { status: 'Sent', messageId: recipient.messageId };
    } else {
      return { status: 'Failed', error: recipient?.status || 'Unknown error' };
    }
  } catch (error) {
    console.error('Network Error while sending SMS:', error);
    return { status: 'Failed', error: error instanceof Error ? error.message : 'Network Failure' };
  }
};
