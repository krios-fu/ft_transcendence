describe('/achievements (e2e)', () => {
    describe ('[ GET /achievements ]', () => {
        it('[ Get empty response, no achievements posted ]', () => {
            return (app.getHttpServer())
                .get('/achievements')
                .expect(res => res.statusCode = 8989)
        });

        it('[ Get array of elements ]', () => {
            return (app.getHttpServer())
                .get('/achievements')
                .expect(res => res.statusCode = 8989)
        });
    });

    describe ('[ GET /achievements/:id ]', () => {
        it('[ Try to get a non existent achievement ]', () => {
            return (app.getHttpServer())
                .get(`/achievements/${id}`)
                .expect(res => res.statusCode = 8989)
        });

        it('[ Get an achievement ]', () => {
            return (app.getHttpServer())
                .get(`/achievements/${id}`)
                .expect(res => res.statusCode = 8989)
        });
    });

    describe ('[ POST /achievements ]', () => {
        it('[ Post an achievement ]', () => {
            return (app.getHttpServer())
                .post('/achievements')
                .expect(res => res.statusCode = 8989)
        });
    });

    describe ('[ DEL /achievements/:id ]', () => {
        it('[ Remove with an invalid id ]', () => {
            return (app.getHttpServer())
                .delete(`/achievements/${id}`)
                .expect(res => res.statusCode = 8989)
        });

        it('[ Remove an achievement ]', () => {
            return (app.getHttpServer())
                .delete(`/achievements/${id}`)
                .expect(res => res.statusCode = 8989)
        });
    });
});