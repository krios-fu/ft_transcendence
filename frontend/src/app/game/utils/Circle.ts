import { Vector } from "./Vector";

export interface   Circle {
    pos: Vector;
    vel: Vector;
    radius: number;
}

interface   QuadraticData {
    a: number;
    b: number;
    c: number;
}

function    interpretCirclesCollision(qData: QuadraticData): [boolean, number] {
    const   discriminant: number = Math.pow(qData.b, 2)
                                    - (4 * qData.a * qData.c);
    let     time1;
    let     time2;
    let     minTime;
    
    if (discriminant < 0)
        return ([false, 0]);
    time1 = (-qData.b + Math.sqrt(discriminant)) / (2 * qData.a);
    time2 = (-qData.b - Math.sqrt(discriminant)) / (2 * qData.a);
    minTime = Math.min(time1, time2);
    if (minTime < 0)
        return ([false, 0]);
    return ([true, minTime]);
}

/*
**  Returns true if there's a collision between the two circles.
**  False otherwise.
**  If true, it returns the time when the collision happens.
**  The time result could be past the seconds elapsed since last
**  update, so this situation must be checked to confirm the collision
**  for this update.
**
**  https://twobitcoder.blogspot.com/2010/04/circle-collision-detection.html
**
**  https://mathinsight.org/dot_product_examples
*/
export function timeCirclesCollision(aCirc: Circle,
                                        bCirc: Circle): [boolean, number] {
    const   posAB: Vector = Vector.subtraction(aCirc.pos, bCirc.pos);
    const   velAB: Vector = Vector.subtraction(aCirc.vel, bCirc.vel);
    const   qData: QuadraticData = {
        a: Vector.dotProduct(velAB, velAB),
        b: 2 * Vector.dotProduct(posAB, velAB),
        c: Vector.dotProduct(posAB, posAB)
            - (Math.pow(aCirc.radius + bCirc.radius, 2))
    };

    return (interpretCirclesCollision(qData));
}
