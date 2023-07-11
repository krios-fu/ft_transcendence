// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/',
  wsUrl: "ws://localhost:3001/",
  staticUrl: "http://localhost:3000/static/",
  redirectUri: 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-81c936cc7d24e290e6d416f295973e3aff1005e5a7a7cf3086428bae0a62c7af&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin&response_type=code'
};

