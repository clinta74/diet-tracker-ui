export const CONFIG = {
    API_URL: process.env.API_URL || 'https://localhost:5001'
}

export const AUTH0 = {
    domain: process.env.REACT_APP_AUTH0_DOMAIN || 'dev-clinta74.us.auth0.com',
    scope: 'openid token email',
    audience: process.env.REACT_APP_AUTH0_AUDIENCE || 'https://diet-tracker.pollyspeople.net',
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || 'I1EPbV0JzhQ4sMebkA5XSg0RhYhJBa1k',
}