import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// This is the main configuration file for NextAuth.js.
// It handles all authentication logic, including sign-in, sign-out, and session management.

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign-in form (e.g., "Sign in with...")
      name: 'Credentials',
      // The credentials are used to generate a suitable form on the sign-in page.
      // You can specify whatever fields you are expecting to be submitted.
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },

      // The authorize function is where you'll add your logic to find the user in your database.
      async authorize(credentials, req) {
        // **IMPORTANT**: This is temporary logic for development.
        // We will replace this with a real database lookup in a future step.
        if (credentials.email === 'test@user.com' && credentials.password === 'password123') {
          // If the credentials are valid, return a user object.
          // The object returned here will be encoded in the JWT.
          // We include a dummy ID and persona for now.
          return { id: '1', name: 'Test User', email: 'test@user.com', persona: 'Startup Sam' };
        } else {
          // If you return null, an error will be displayed to the user.
          return null;
        }
      },
    }),
  ],

  // We are using JSON Web Tokens for session management.
  session: {
    strategy: 'jwt',
  },

  // Callbacks are async functions you can use to control what happens when an action is performed.
  callbacks: {
    // The 'jwt' callback is called whenever a JWT is created (i.e., at sign-in) or updated.
    async jwt({ token, user }) {
      // When the user first signs in, the 'user' object from the 'authorize' function is available.
      // We persist the user's ID and persona to the token.
      if (user) {
        token.id = user.id;
        token.persona = user.persona;
      }
      return token;
    },

    // The 'session' callback is called whenever a session is checked.
    // We pass the data from the token to the session object, which is then available on the client-side.
    async session({ session, token }) {
      // Add the user ID and persona to the session object.
      if (token) {
        session.user.id = token.id;
        session.user.persona = token.persona;
      }
      return session;
    },
  },

  // Specify custom pages for sign-in, errors, etc.
  pages: {
    signIn: '/auth/signin',
    // You can add other pages like signOut, error, verifyRequest, etc.
  },

  // Secret for signing the JWT. In production, this must be an environment variable.
  secret: process.env.NEXTAUTH_SECRET || 'a-very-secret-string-for-development',

  // Enable debug messages for development
  debug: process.env.NODE_ENV === 'development',
});
