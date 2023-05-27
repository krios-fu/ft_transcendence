import { Transform, Type } from "class-transformer";
import { IsArray, 
    IsBoolean, 
    IsEmail, 
    IsOptional, 
    IsString, 
    ValidateNested } from "class-validator";
import { HasValidFields } from "src/common/decorators/order.decorator";
import { BaseQueryDto, BaseQueryFilterDto } from "src/common/dtos/base.query.dto";
import { intoArrayOfParams } from "src/common/validators/fields-validator.class";

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
    @IsEmail(/*{ each: true }*/) /* needs testing */
    @Transform(({ value }) => intoArrayOfParams(value))
    email?: string[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    nickName?: string[];
}

export class UserQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    @HasValidFields(
        ['id', 'username', 'firstName', 'lastName', 'email', 'nickName', 'creationDate', 'lastConnection']
    )
    order?: string[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    @HasValidFields(
        ['id', 'username', 'firstName', 'lastName', 'email', 'nickName', 'creationDate', 'lastConnection']
    )
    orderDesc?: string[];

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => UserQueryFilterDto)
    filter?: UserQueryFilterDto;

    @IsOptional()
    @IsString({ each: true })
    range?: Map<string, string>;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value} ) => value === 'true') //Strings !== 'true' are converted to false
    count?: boolean;

    @IsOptional()
    @IsString()
    target?: string;
}
