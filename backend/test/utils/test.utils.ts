export const getCredentials = () => {
    const res = await request(app.getHttpServer())
        .post('/auth/generate')
        .send({ 
            'userProfile': userCreds, 
            'app_id': process.env.FORTYTWO_APP_ID, 
            'app_secret': process.env.FORTYTWO_APP_SECRET
        });
    return res.body.authToken;
}