# ~~ beautify ~~
rd='\033[31m'
gr='\033[32m'
yl='\033[33m'
bl='\033[34m'
fn='\033[0m'

room_name='placeholder'
user_name='placeholder'



# ~~ ban batch ~~ 
echo -e $gr "[ GET /ban ]" $fn
./aim.sh 'ban' 'getall'
echo -e $gr '[ GET /ban/1 ]' $fn
./aim.sh 'ban' 'get' '1'
echo -e $gr "[ GET /ban/rooms/$room_name ]" $fn
./aim.sh 'ban' 'getrooms' $room_name
echo -e $gr "[ GET /ban/users/$user_name ]" $fn
./aim.sh 'ban' 'getusers' $user_name
echo -e $bl "[ POST /ban ]" $fn
./aim.sh 'ban' 'post' $room_name $user_name
echo -e $rd "[ DELETE /ban ]" $fn
./aim.sh 'ban' 'del' '1' 

# ~~ user batch ~~
echo -e $gr "[ GET /user ]" $fn
./aim.sh 'user' 'getall'
echo -e $gr '[ GET /user/bobo ]' $fn
./aim.sh 'user' 'get' 'bobo'
echo -e $bl "[ POST /user ]" $fn
./aim.sh 'user' 'post' 'bobo' 'bobo-fn' 'bobo-ln' 'bobo-pu' 'bobo-e' 'bobo-ph'
echo -e $yl "[ PATCH /user/bobo ]" $fn
./aim.sh 'user' 'patch' 'bobo' # ~~ tbc ~~
echo -e $rd "[ DELETE /user/bobo ]" $fn
./aim.sh 'user' 'del' 'bobo' 