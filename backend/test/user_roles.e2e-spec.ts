export const genUserRolesQuery = queryParams => queryParams.map(qp, `INSERT INTO user_roles (userId, roomId) VALUES (${qp.userId},${qp.roleId});`)
    .reduce((qTotal, q) => qTotal + q, '');

describe('/user_roles (e2e)', () => {
    it ('[ placeholder ]', () => {
        expect(1).toBe(1);
    });
});