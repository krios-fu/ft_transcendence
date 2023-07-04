// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/',
  wsUrl: "ws://localhost:3001/",
  redirectUri: 'https://api.intra.42.fr/oauth/authorize?client_id=69aeb66a278743631dbafcd44c86243a16b425b19a096d176dc681ae7fadc3dd&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin&response_type=code'
};

