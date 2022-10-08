# ~~ beautify ~~
rd='\033[31m'
gr='\033[32m'
yl='\033[33m'
bl='\033[34m'
fn='\033[0m'

room_name='placeholder'
user_name='placeholder'



# ~~ ban batch ~~ 
echo $gr "[ GET /ban ]" $fn
./aim.sh 'ban' 'getall'
echo $gr '[ GET /ban/1 ]' $fn
./aim.sh 'ban' 'get' '1'
echo $gr "[ GET /ban/rooms/$room_name ]" $fn
./aim.sh 'ban' 'getrooms' $room_name
echo $gr "[ GET /ban/users/$user_name ]" $fn
./aim.sh 'ban' 'getusers' $user_name
echo $bl "[ POST /ban ]" $fn
./aim.sh 'ban' 'post' $room_name $user_name
echo $rd "[ DELETE /ban ]" $fn
./aim.sh 'ban' 'del' '1' 

# ~~ user batch ~~
echo $gr "[ GET /user ]" $fn
./aim.sh 'user' 'getall'
echo $gr "[ GET /user/$user_name ]" $fn
./aim.sh 'user' 'get' "$user_name"
echo $bl "[ POST /user/new ]" $fn
./aim.sh 'user' 'post' "$user_name"
echo $yl "[ PATCH /user/$user_name ]" $fn
./aim.sh 'user' 'patch' "$user_name" # ~~ tbc ~~
echo $rd "[ DELETE /user/$user_name ]" $fn
./aim.sh 'user' 'del' "$user_name" 

# ~~ room batch ~~ 
echo $gr "[ GET /room ]" $fn
./aim.sh 'room' 'getall'
echo $gr "[ GET /room/$user_name ]" $fn
./aim.sh 'room' 'get' "$room_name"
echo $gr "[ GET /room/$room_name/owner ]" $fn
./aim.sh 'room' 'getown' "$room_name"
echo $bl "[ POST /room ]" $fn
./aim.sh 'room' 'post' "$room_name" "$user_name"
echo $yl "[ PATCH /$user_name ]" $fn
./aim.sh 'user' 'patch' '$user_name' # ~~ tbc ~~
echo $rd "[ DELETE /user/$user_name ]" $fn
./aim.sh 'user' 'del' '$user_name'

# ~~ roles batch ~~ PEND.
echo $gr "[ GET /roles ]" $fn
./aim.sh 'room' 'getall'
echo $gr "[ GET /roles/$user_name ]" $fn
./aim.sh 'room' 'get' "$room_name"
echo $bl "[ POST /roles ]" $fn
./aim.sh 'room' 'post' "$user_name" "$room_name"
echo $yl "[ PATCH /roles/$user_name ]" $fn
./aim.sh 'user' 'patch' '$user_name' # ~~ tbc ~~
echo $rd "[ DELETE /roles/$user_name ]" $fn
./aim.sh 'user' 'del' '$user_name'