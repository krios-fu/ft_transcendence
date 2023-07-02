// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/',
  wsUrl: "ws://localhost:3001/",
  redirectUri: 'https://api.intra.42.fr/oauth/authorize?client_id=4fa51aeb8eafcafd00c2b72a70720daf534190b81adf41fb9874c83bb9563042&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin&response_type=code'
};

