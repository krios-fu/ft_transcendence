import { Transform, Type } from "class-transformer";
import { IsArray, IsEmail, IsOptional, IsString, ValidateNested } from "class-validator";
import { HasValidFields } from "../../common/decorators/order.decorator";
import { BaseQueryFilterDto } from "../../common/dtos/base.query.dto";
import { intoArrayOfParams } from "../../common/validators/fields-validator.class";

class UserQueryFilterDto extends BaseQueryFilterDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    username?: string[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    firstName?: string[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    lastName?: string[];

    @IsOptional()
    @IsArray()
    @IsEmail({}, { each: true }) /* needs testing */
    @Transform(({ value }) => intoArrayOfParams(value))
    email?: string[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    nickName?: string[];
}

export class UserQueryDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(','))
    @HasValidFields(
        ['id', 'username', 'firstName', 'lastName', 'email', 'nickName', 'creationDate', 'lastConnection']
    )
    sort?: string;

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => UserQueryFilterDto)
    filter?: UserQueryFilterDto;

    @IsOptional()
    @IsString({ each: true })
    range?: Map<string, string>;
}