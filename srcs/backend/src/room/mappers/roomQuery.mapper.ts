import {
    IsNull,
    Like,
    Not
} from "typeorm";
import { RoomQueryDto } from "../dto/room.query.dto";

/*
**  Inserts the same 'where' object but checking for rooms
**  with no role as well, which are considered public by default.
*/
function    includeNullRoles(whereObject :{ [key: string]: any }[]) {
    const   clone = {...whereObject[0]};

    clone.roomRole = {
        role: IsNull()
    }
    whereObject.push(
        clone
    )
}

const filterSetup = filter => { 
    let keyFilter = [];
    for (let key in filter) {
        keyFilter.push(
            filter[key].map(value => {
                if (['nickName', 'roomName'].includes(key))
                    return { [key]: Like(`${value}%`) };
                if (key === 'roomRole')
                {
                    if (value === 'public')
                        value = Not('private');
                    return {
                        [key]: {
                            role: {
                                role: value
                            }
                        }
                    };
                }
                return { [key]: value };
            })
        );
    }
    return keyFilter;
}
const cartesian = (...f) => f.reduce((ac,cv) => ac.flatMap((aci) => cv.map((cvi) => Object.assign({}, aci, cvi))))

export class RoomQueryMapper {
    constructor(queryParams: RoomQueryDto) {
        const { limit, offset, order, filter } = queryParams; 
        if (limit !== undefined) {
            this.take = limit;
        }
        if (offset !== undefined) {
            this.skip = offset;
        }
        if (order !== undefined) {
            this.order = {};
            order?.forEach((value: string) => {
                Object.assign(this.order, { [value]: 'ASC' })
            });
        }
        if (filter !== undefined) {
            this.where = cartesian(...filterSetup(filter));
            if (filter.roomRole)
            {
                this.relations = {
                    roomRole: {
                        role: true
                    }
                }
                if (filter.roomRole.includes('public'))
                    includeNullRoles(this.where);
            }
        }
    }
    relations?: { [key: string]: any }
    take?: number;
    skip?: number;
    order?: { [key: string]: string }
    where?: { [key: string]: any }[];
}
